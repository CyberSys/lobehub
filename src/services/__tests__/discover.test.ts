import { beforeEach, describe, expect, it, vi } from 'vitest';

import { lambdaClient } from '@/libs/trpc/client';
import { globalHelpers } from '@/store/global/helpers';
import { useUserStore } from '@/store/user';
import { userGeneralSettingsSelectors } from '@/store/user/selectors';
import { cleanObject } from '@/utils/object';

import { discoverService } from '../discover';

// Mock dependencies
vi.mock('@/libs/trpc/client', () => ({
  lambdaClient: {
    market: {
      getAssistantCategories: { query: vi.fn() },
      getAssistantDetail: { query: vi.fn() },
      getAssistantIdentifiers: { query: vi.fn() },
      getAssistantList: { query: vi.fn() },
      getMcpCategories: { query: vi.fn() },
      getMcpDetail: { query: vi.fn() },
      getMcpList: { query: vi.fn() },
      getMcpManifest: { query: vi.fn() },
      getModelCategories: { query: vi.fn() },
      getModelDetail: { query: vi.fn() },
      getModelIdentifiers: { query: vi.fn() },
      getModelList: { query: vi.fn() },
      getPluginCategories: { query: vi.fn() },
      getPluginDetail: { query: vi.fn() },
      getPluginIdentifiers: { query: vi.fn() },
      getPluginList: { query: vi.fn() },
      getProviderDetail: { query: vi.fn() },
      getProviderIdentifiers: { query: vi.fn() },
      getProviderList: { query: vi.fn() },
      getUserInfo: { query: vi.fn() },
      getGroupAgentCategories: { query: vi.fn() },
      getGroupAgentDetail: { query: vi.fn() },
      getGroupAgentIdentifiers: { query: vi.fn() },
      getGroupAgentList: { query: vi.fn() },
      registerClientInMarketplace: { mutate: vi.fn() },
      registerM2MToken: { query: vi.fn() },
      reportMcpInstallResult: { mutate: vi.fn() },
      reportCall: { mutate: vi.fn() },
      reportMcpEvent: { mutate: vi.fn() },
      reportAgentInstall: { mutate: vi.fn() },
      reportAgentEvent: { mutate: vi.fn() },
      reportGroupAgentEvent: { mutate: vi.fn() },
      reportGroupAgentInstall: { mutate: vi.fn() },
    },
  },
}));

vi.mock('@/store/global/helpers', () => ({
  globalHelpers: {
    getCurrentLanguage: vi.fn(),
  },
}));

vi.mock('@/store/user', () => ({
  useUserStore: {
    getState: vi.fn(),
  },
}));

vi.mock('@/store/user/selectors', () => ({
  userGeneralSettingsSelectors: {
    telemetry: vi.fn(),
  },
}));

vi.mock('@/utils/object', () => ({
  cleanObject: vi.fn((obj) => obj),
}));

describe('DiscoverService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(globalHelpers.getCurrentLanguage).mockReturnValue('en-US');
  });

  // ============================== Assistant Market ==============================

  describe('getAssistantCategories', () => {
    it('should fetch assistant categories with locale', async () => {
      const mockCategories = [
        { id: '1', name: 'Category 1', category: 'test', count: 5 },
        { id: '2', name: 'Category 2', category: 'test2', count: 10 },
      ] as any;
      vi.mocked(lambdaClient.market.getAssistantCategories.query).mockResolvedValue(mockCategories);

      const result = await discoverService.getAssistantCategories();

      expect(globalHelpers.getCurrentLanguage).toHaveBeenCalled();
      expect(lambdaClient.market.getAssistantCategories.query).toHaveBeenCalledWith({
        locale: 'en-US',
        source: undefined,
      });
      expect(result).toEqual(mockCategories);
    });

    it('should pass source parameter when provided', async () => {
      const mockCategories = [{ id: '1', name: 'Category 1', category: 'test', count: 5 }] as any;
      vi.mocked(lambdaClient.market.getAssistantCategories.query).mockResolvedValue(mockCategories);

      await discoverService.getAssistantCategories({ source: 'community/assistant' as any });

      expect(lambdaClient.market.getAssistantCategories.query).toHaveBeenCalledWith({
        locale: 'en-US',
        source: 'community/assistant',
      });
    });
  });

  describe('getAssistantDetail', () => {
    it('should fetch assistant detail with identifier', async () => {
      const mockDetail = {
        identifier: 'test-assistant',
        name: 'Test Assistant',
        description: 'Test description',
      } as any;
      vi.mocked(lambdaClient.market.getAssistantDetail.query).mockResolvedValue(mockDetail as any);

      const result = await discoverService.getAssistantDetail({ identifier: 'test-assistant' });

      expect(lambdaClient.market.getAssistantDetail.query).toHaveBeenCalledWith({
        identifier: 'test-assistant',
        locale: 'en-US',
        source: undefined,
        version: undefined,
      });
      expect(result).toEqual(mockDetail);
    });

    it('should pass version and source when provided', async () => {
      const mockDetail = { identifier: 'test', name: 'Test' } as any;
      vi.mocked(lambdaClient.market.getAssistantDetail.query).mockResolvedValue(mockDetail as any);

      await discoverService.getAssistantDetail({
        identifier: 'test-assistant',
        source: 'community/assistant' as any,
        version: '1.0.0',
      });

      expect(lambdaClient.market.getAssistantDetail.query).toHaveBeenCalledWith({
        identifier: 'test-assistant',
        locale: 'en-US',
        source: 'community/assistant',
        version: '1.0.0',
      });
    });
  });

  describe('getAssistantList', () => {
    it('should fetch assistant list with default pagination', async () => {
      const mockResponse = {
        data: [{ identifier: 'test', name: 'Test' }],
        total: 1,
      };
      vi.mocked(lambdaClient.market.getAssistantList.query).mockResolvedValue(mockResponse as any);

      const result = await discoverService.getAssistantList();

      expect(lambdaClient.market.getAssistantList.query).toHaveBeenCalledWith(
        {
          locale: 'en-US',
          page: 1,
          pageSize: 20,
        },
        { context: { showNotification: false } },
      );
      expect(result).toEqual(mockResponse);
    });

    it('should convert string page and pageSize to numbers', async () => {
      const mockResponse = { data: [], total: 0 };
      vi.mocked(lambdaClient.market.getAssistantList.query).mockResolvedValue(mockResponse as any);

      await discoverService.getAssistantList({ page: '2' as any, pageSize: '50' as any });

      expect(lambdaClient.market.getAssistantList.query).toHaveBeenCalledWith(
        {
          locale: 'en-US',
          page: 2,
          pageSize: 50,
        },
        { context: { showNotification: false } },
      );
    });
  });

  // ============================== MCP Market ==============================

  describe('getMcpList', () => {
    it('should fetch MCP list with default pagination', async () => {
      const mockResponse = {
        data: [{ identifier: 'test-mcp', name: 'Test MCP' }],
        total: 1,
      };
      vi.mocked(lambdaClient.market.getMcpList.query).mockResolvedValue(mockResponse as any);

      const result = await discoverService.getMcpList();

      expect(lambdaClient.market.getMcpList.query).toHaveBeenCalledWith({
        locale: 'en-US',
        page: 1,
        pageSize: 20,
      });
      expect(result).toEqual(mockResponse);
    });

    it('should handle custom page and pageSize', async () => {
      const mockResponse = { data: [], total: 0 };
      vi.mocked(lambdaClient.market.getMcpList.query).mockResolvedValue(mockResponse as any);

      await discoverService.getMcpList({ page: '3' as any, pageSize: '10' as any });

      expect(lambdaClient.market.getMcpList.query).toHaveBeenCalledWith({
        locale: 'en-US',
        page: 3,
        pageSize: 10,
      });
    });
  });

  describe('getMCPPluginList', () => {
    it('should inject MP token before fetching MCP plugin list', async () => {
      const mockResponse = { data: [], total: 0 };
      vi.mocked(lambdaClient.market.getMcpList.query).mockResolvedValue(mockResponse as any);
      vi.mocked(lambdaClient.market.registerM2MToken.query).mockResolvedValue({
        success: true,
      });

      // Mock localStorage
      Object.defineProperty(global, 'localStorage', {
        value: {
          getItem: vi.fn(),
          setItem: vi.fn(),
          removeItem: vi.fn(),
        },
        writable: true,
      });

      // Mock document.cookie
      Object.defineProperty(document, 'cookie', {
        value: 'mp_token_status=active',
        writable: true,
      });

      await discoverService.getMCPPluginList({ page: 1 });

      expect(lambdaClient.market.getMcpList.query).toHaveBeenCalledWith({
        locale: 'en-US',
        page: 1,
        pageSize: 21,
      });
    });
  });

  describe('getMcpManifest', () => {
    it('should fetch MCP manifest with identifier', async () => {
      const mockManifest = { identifier: 'test-mcp', version: '1.0.0' };
      vi.mocked(lambdaClient.market.getMcpManifest.query).mockResolvedValue(mockManifest as any);

      const result = await discoverService.getMcpManifest({ identifier: 'test-mcp' });

      expect(lambdaClient.market.getMcpManifest.query).toHaveBeenCalledWith({
        identifier: 'test-mcp',
        locale: 'en-US',
        version: undefined,
      });
      expect(result).toEqual(mockManifest);
    });
  });

  describe('getMCPPluginManifest', () => {
    it('should fetch MCP plugin manifest with identifier', async () => {
      const mockManifest = { identifier: 'test-plugin', version: '1.0.0' };
      vi.mocked(lambdaClient.market.getMcpManifest.query).mockResolvedValue(mockManifest as any);

      const result = await discoverService.getMCPPluginManifest('test-plugin');

      expect(lambdaClient.market.getMcpManifest.query).toHaveBeenCalledWith({
        identifier: 'test-plugin',
        install: undefined,
        locale: 'en-US',
      });
      expect(result).toEqual(mockManifest);
    });

    it('should pass install option when provided', async () => {
      const mockManifest = { identifier: 'test-plugin', version: '1.0.0' };
      vi.mocked(lambdaClient.market.getMcpManifest.query).mockResolvedValue(mockManifest as any);

      await discoverService.getMCPPluginManifest('test-plugin', { install: true });

      expect(lambdaClient.market.getMcpManifest.query).toHaveBeenCalledWith({
        identifier: 'test-plugin',
        install: true,
        locale: 'en-US',
      });
    });
  });

  // ============================== Reporting ==============================

  describe('reportMcpInstallResult', () => {
    beforeEach(() => {
      // Mock document.cookie for token status
      Object.defineProperty(document, 'cookie', {
        value: 'mp_token_status=active',
        writable: true,
      });
    });

    it('should not report when telemetry is disabled', async () => {
      vi.mocked(userGeneralSettingsSelectors.telemetry).mockReturnValue(false);

      await discoverService.reportMcpInstallResult({
        identifier: 'test-mcp',
        version: '1.0.0',
        success: true,
      });

      expect(lambdaClient.market.reportMcpInstallResult.mutate).not.toHaveBeenCalled();
    });

    it('should report successful installation when telemetry is enabled', async () => {
      vi.mocked(userGeneralSettingsSelectors.telemetry).mockReturnValue(true);
      vi.mocked(lambdaClient.market.reportMcpInstallResult.mutate).mockResolvedValue(
        undefined as any,
      );

      await discoverService.reportMcpInstallResult({
        identifier: 'test-mcp',
        manifest: { identifier: 'test-mcp', version: '1.0.0' } as any,
        success: true,
        version: '1.0.0',
      });

      expect(lambdaClient.market.reportMcpInstallResult.mutate).toHaveBeenCalledWith({
        identifier: 'test-mcp',
        manifest: { identifier: 'test-mcp', version: '1.0.0' },
        success: true,
        version: '1.0.0',
      });
    });

    it('should report failed installation with error details', async () => {
      vi.mocked(userGeneralSettingsSelectors.telemetry).mockReturnValue(true);
      vi.mocked(lambdaClient.market.reportMcpInstallResult.mutate).mockResolvedValue(
        undefined as any,
      );

      await discoverService.reportMcpInstallResult({
        errorCode: 'INSTALL_FAILED',
        errorMessage: 'Installation failed',
        identifier: 'test-mcp',
        version: '1.0.0',
        success: false,
      });

      expect(lambdaClient.market.reportMcpInstallResult.mutate).toHaveBeenCalledWith({
        errorCode: 'INSTALL_FAILED',
        errorMessage: 'Installation failed',
        identifier: 'test-mcp',
        version: '1.0.0',
        success: false,
      });
    });

    it('should handle report errors gracefully', async () => {
      vi.mocked(userGeneralSettingsSelectors.telemetry).mockReturnValue(true);
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      vi.mocked(lambdaClient.market.reportMcpInstallResult.mutate).mockRejectedValue(
        new Error('Network error'),
      );

      await discoverService.reportMcpInstallResult({
        identifier: 'test-mcp',
        version: '1.0.0',
        success: true,
      });

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Failed to report MCP installation result:',
        expect.any(Error),
      );
      consoleWarnSpy.mockRestore();
    });
  });

  describe('reportPluginCall', () => {
    beforeEach(() => {
      Object.defineProperty(document, 'cookie', {
        value: 'mp_token_status=active',
        writable: true,
      });
    });

    it('should not report when telemetry is disabled', async () => {
      vi.mocked(userGeneralSettingsSelectors.telemetry).mockReturnValue(false);

      await discoverService.reportPluginCall({
        identifier: 'test-plugin',
        version: '1.0.0',
        methodName: 'test',
        methodType: 'tool',
        callDurationMs: 100,
        success: true,
      } as any);

      expect(lambdaClient.market.reportCall.mutate).not.toHaveBeenCalled();
    });

    it('should report plugin call when telemetry is enabled', async () => {
      vi.mocked(userGeneralSettingsSelectors.telemetry).mockReturnValue(true);
      vi.mocked(lambdaClient.market.reportCall.mutate).mockResolvedValue(undefined as any);

      await discoverService.reportPluginCall({
        identifier: 'test-plugin',
        version: '1.0.0',
        methodName: 'test',
        methodType: 'tool',
        callDurationMs: 100,
        success: true,
      } as any);

      expect(lambdaClient.market.reportCall.mutate).toHaveBeenCalledWith({
        callDurationMs: 100,
        identifier: 'test-plugin',
        methodName: 'test',
        methodType: 'tool',
        success: true,
        version: '1.0.0',
      });
    });
  });

  describe('reportAgentInstall', () => {
    beforeEach(() => {
      Object.defineProperty(document, 'cookie', {
        value: 'mp_token_status=active',
        writable: true,
      });
    });

    it('should not report when telemetry is disabled', async () => {
      vi.mocked(userGeneralSettingsSelectors.telemetry).mockReturnValue(false);

      await discoverService.reportAgentInstall('test-agent');

      expect(lambdaClient.market.reportAgentInstall.mutate).not.toHaveBeenCalled();
    });

    it('should report agent installation when telemetry is enabled', async () => {
      vi.mocked(userGeneralSettingsSelectors.telemetry).mockReturnValue(true);
      vi.mocked(lambdaClient.market.reportAgentInstall.mutate).mockResolvedValue(undefined as any);

      await discoverService.reportAgentInstall('test-agent');

      expect(lambdaClient.market.reportAgentInstall.mutate).toHaveBeenCalledWith({
        identifier: 'test-agent',
      });
    });
  });

  describe('reportMcpEvent', () => {
    beforeEach(() => {
      Object.defineProperty(document, 'cookie', {
        value: 'mp_token_status=active',
        writable: true,
      });
    });

    it('should not report when telemetry is disabled', async () => {
      vi.mocked(userGeneralSettingsSelectors.telemetry).mockReturnValue(false);

      await discoverService.reportMcpEvent({ event: 'click', identifier: 'test-mcp' } as any);

      expect(lambdaClient.market.reportMcpEvent.mutate).not.toHaveBeenCalled();
    });

    it('should report MCP event with default source', async () => {
      vi.mocked(userGeneralSettingsSelectors.telemetry).mockReturnValue(true);
      vi.mocked(lambdaClient.market.reportMcpEvent.mutate).mockResolvedValue(undefined as any);

      await discoverService.reportMcpEvent({ event: 'click', identifier: 'test-mcp' } as any);

      expect(cleanObject).toHaveBeenCalled();
      expect(lambdaClient.market.reportMcpEvent.mutate).toHaveBeenCalledWith({
        event: 'click',
        identifier: 'test-mcp',
        source: 'community/mcp',
      });
    });
  });

  describe('reportAgentEvent', () => {
    beforeEach(() => {
      Object.defineProperty(document, 'cookie', {
        value: 'mp_token_status=active',
        writable: true,
      });
    });

    it('should report agent event with default source', async () => {
      vi.mocked(userGeneralSettingsSelectors.telemetry).mockReturnValue(true);
      vi.mocked(lambdaClient.market.reportAgentEvent.mutate).mockResolvedValue(undefined as any);

      await discoverService.reportAgentEvent({ event: 'add', identifier: 'test-agent' } as any);

      expect(lambdaClient.market.reportAgentEvent.mutate).toHaveBeenCalledWith({
        event: 'add',
        identifier: 'test-agent',
        source: 'community/agent',
      });
    });
  });

  // ============================== Models ==============================

  describe('getModelList', () => {
    it('should fetch model list with default pagination', async () => {
      const mockResponse = {
        data: [{ identifier: 'test-model', name: 'Test Model' }],
        total: 1,
      };
      vi.mocked(lambdaClient.market.getModelList.query).mockResolvedValue(mockResponse as any);

      const result = await discoverService.getModelList();

      expect(lambdaClient.market.getModelList.query).toHaveBeenCalledWith({
        locale: 'en-US',
        page: 1,
        pageSize: 20,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getModelDetail', () => {
    it('should fetch model detail with identifier', async () => {
      const mockDetail = { identifier: 'test-model', name: 'Test Model' };
      vi.mocked(lambdaClient.market.getModelDetail.query).mockResolvedValue(mockDetail as any);

      const result = await discoverService.getModelDetail({ identifier: 'test-model' });

      expect(lambdaClient.market.getModelDetail.query).toHaveBeenCalledWith({
        identifier: 'test-model',
        locale: 'en-US',
      });
      expect(result).toEqual(mockDetail);
    });
  });

  // ============================== Plugins ==============================

  describe('getPluginList', () => {
    it('should fetch plugin list with default pagination', async () => {
      const mockResponse = {
        data: [{ identifier: 'test-plugin', name: 'Test Plugin' }],
        total: 1,
      };
      vi.mocked(lambdaClient.market.getPluginList.query).mockResolvedValue(mockResponse as any);

      const result = await discoverService.getPluginList();

      expect(lambdaClient.market.getPluginList.query).toHaveBeenCalledWith({
        locale: 'en-US',
        page: 1,
        pageSize: 20,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getPluginDetail', () => {
    it('should fetch plugin detail with withManifest option', async () => {
      const mockDetail = { identifier: 'test-plugin', name: 'Test Plugin' };
      vi.mocked(lambdaClient.market.getPluginDetail.query).mockResolvedValue(mockDetail as any);

      const result = await discoverService.getPluginDetail({
        identifier: 'test-plugin',
        withManifest: true,
      });

      expect(lambdaClient.market.getPluginDetail.query).toHaveBeenCalledWith({
        identifier: 'test-plugin',
        locale: 'en-US',
        withManifest: true,
      });
      expect(result).toEqual(mockDetail);
    });
  });

  // ============================== Providers ==============================

  describe('getProviderList', () => {
    it('should fetch provider list with default pagination', async () => {
      const mockResponse = {
        data: [{ identifier: 'test-provider', name: 'Test Provider' }],
        total: 1,
      };
      vi.mocked(lambdaClient.market.getProviderList.query).mockResolvedValue(mockResponse as any);

      const result = await discoverService.getProviderList();

      expect(lambdaClient.market.getProviderList.query).toHaveBeenCalledWith({
        locale: 'en-US',
        page: 1,
        pageSize: 20,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getProviderDetail', () => {
    it('should fetch provider detail with withReadme option', async () => {
      const mockDetail = { identifier: 'test-provider', name: 'Test Provider' };
      vi.mocked(lambdaClient.market.getProviderDetail.query).mockResolvedValue(mockDetail as any);

      const result = await discoverService.getProviderDetail({
        identifier: 'test-provider',
        withReadme: true,
      });

      expect(lambdaClient.market.getProviderDetail.query).toHaveBeenCalledWith({
        identifier: 'test-provider',
        locale: 'en-US',
        withReadme: true,
      });
      expect(result).toEqual(mockDetail);
    });
  });

  // ============================== User Profile ==============================

  describe('getUserInfo', () => {
    it('should fetch user info with username', async () => {
      const mockProfile = { username: 'testuser', name: 'Test User' };
      vi.mocked(lambdaClient.market.getUserInfo.query).mockResolvedValue(mockProfile as any);

      const result = await discoverService.getUserInfo({ username: 'testuser' });

      expect(lambdaClient.market.getUserInfo.query).toHaveBeenCalledWith({
        locale: 'en-US',
        username: 'testuser',
      });
      expect(result).toEqual(mockProfile);
    });
  });

  // ============================== Group Agent Market ==============================

  describe('getGroupAgentList', () => {
    it('should fetch group agent list with default pagination', async () => {
      const mockResponse = {
        data: [{ identifier: 'test-group', name: 'Test Group' }],
        total: 1,
      };
      vi.mocked(lambdaClient.market.getGroupAgentList.query).mockResolvedValue(mockResponse as any);

      const result = await discoverService.getGroupAgentList();

      expect(lambdaClient.market.getGroupAgentList.query).toHaveBeenCalledWith(
        {
          locale: 'en-US',
          page: 1,
          pageSize: 20,
        },
        { context: { showNotification: false } },
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getGroupAgentDetail', () => {
    it('should fetch group agent detail with identifier', async () => {
      const mockDetail = { identifier: 'test-group', name: 'Test Group' };
      vi.mocked(lambdaClient.market.getGroupAgentDetail.query).mockResolvedValue(mockDetail as any);

      const result = await discoverService.getGroupAgentDetail({ identifier: 'test-group' });

      expect(lambdaClient.market.getGroupAgentDetail.query).toHaveBeenCalledWith({
        identifier: 'test-group',
        locale: 'en-US',
        version: undefined,
      });
      expect(result).toEqual(mockDetail);
    });
  });

  describe('reportGroupAgentEvent', () => {
    it('should report group agent event', async () => {
      vi.mocked(lambdaClient.market.reportGroupAgentEvent.mutate).mockResolvedValue(
        undefined as any,
      );

      await discoverService.reportGroupAgentEvent({
        event: 'add',
        identifier: 'test-group',
        source: 'custom',
      });

      expect(lambdaClient.market.reportGroupAgentEvent.mutate).toHaveBeenCalledWith({
        event: 'add',
        identifier: 'test-group',
        source: 'custom',
      });
    });
  });

  describe('reportGroupAgentInstall', () => {
    it('should report group agent installation', async () => {
      vi.mocked(lambdaClient.market.reportGroupAgentInstall.mutate).mockResolvedValue(
        undefined as any,
      );

      await discoverService.reportGroupAgentInstall('test-group');

      expect(lambdaClient.market.reportGroupAgentInstall.mutate).toHaveBeenCalledWith({
        identifier: 'test-group',
      });
    });
  });

  // ============================== Helpers ==============================

  describe('registerClient', () => {
    it('should register client in marketplace', async () => {
      const mockClientInfo = { clientId: 'client-123', clientSecret: 'secret-456' };
      vi.mocked(lambdaClient.market.registerClientInMarketplace.mutate).mockResolvedValue(
        mockClientInfo,
      );

      const result = await discoverService.registerClient();

      expect(lambdaClient.market.registerClientInMarketplace.mutate).toHaveBeenCalledWith({});
      expect(result).toEqual(mockClientInfo);
    });
  });

  describe('injectMPToken', () => {
    beforeEach(() => {
      // Reset localStorage mock
      Object.defineProperty(global, 'localStorage', {
        value: {
          getItem: vi.fn(),
          removeItem: vi.fn(),
          setItem: vi.fn(),
        },
        writable: true,
      });
    });

    it('should skip injection when token status is active', async () => {
      Object.defineProperty(document, 'cookie', {
        value: 'mp_token_status=active',
        writable: true,
      });

      await discoverService.injectMPToken();

      expect(localStorage.getItem).not.toHaveBeenCalled();
    });

    it('should skip injection in server environment (no localStorage)', async () => {
      // Temporarily override localStorage to be undefined
      const originalLocalStorage = global.localStorage;
      // @ts-ignore
      global.localStorage = undefined;

      await discoverService.injectMPToken();

      // Should return early without errors
      expect(lambdaClient.market.registerClientInMarketplace.mutate).not.toHaveBeenCalled();

      // Restore localStorage
      global.localStorage = originalLocalStorage;
    });

    it('should register new client when localStorage is empty', async () => {
      Object.defineProperty(document, 'cookie', {
        value: '',
        writable: true,
      });

      const mockClientInfo = { clientId: 'client-123', clientSecret: 'secret-456' };
      vi.mocked(localStorage.getItem).mockReturnValue(null);
      vi.mocked(lambdaClient.market.registerClientInMarketplace.mutate).mockResolvedValue(
        mockClientInfo,
      );
      vi.mocked(lambdaClient.market.registerM2MToken.query).mockResolvedValue({ success: true });

      await discoverService.injectMPToken();

      expect(localStorage.getItem).toHaveBeenCalledWith('_mpc');
      expect(lambdaClient.market.registerClientInMarketplace.mutate).toHaveBeenCalled();
      expect(localStorage.setItem).toHaveBeenCalledWith('_mpc', expect.any(String));
    });

    it('should use existing client credentials from localStorage', async () => {
      Object.defineProperty(document, 'cookie', {
        value: '',
        writable: true,
      });

      const clientData = { clientId: 'existing-123', clientSecret: 'existing-secret' };
      const encodedData = btoa(JSON.stringify(clientData));
      vi.mocked(localStorage.getItem).mockReturnValue(encodedData);
      vi.mocked(lambdaClient.market.registerM2MToken.query).mockResolvedValue({ success: true });

      await discoverService.injectMPToken();

      expect(localStorage.getItem).toHaveBeenCalledWith('_mpc');
      expect(lambdaClient.market.registerM2MToken.query).toHaveBeenCalledWith({
        clientId: 'existing-123',
        clientSecret: 'existing-secret',
      });
    });

    it('should re-register when token registration fails', async () => {
      Object.defineProperty(document, 'cookie', {
        value: '',
        writable: true,
      });

      const clientData = { clientId: 'invalid-123', clientSecret: 'invalid-secret' };
      const encodedData = btoa(JSON.stringify(clientData));

      // First call returns existing credentials, second call returns null (after removal)
      vi.mocked(localStorage.getItem).mockReturnValueOnce(encodedData).mockReturnValueOnce(null);

      // First call fails, second call succeeds
      const newClientInfo = { clientId: 'new-123', clientSecret: 'new-secret' };
      vi.mocked(lambdaClient.market.registerM2MToken.query)
        .mockResolvedValueOnce({ success: false })
        .mockResolvedValueOnce({ success: true });
      vi.mocked(lambdaClient.market.registerClientInMarketplace.mutate).mockResolvedValue(
        newClientInfo,
      );

      await discoverService.injectMPToken();

      expect(localStorage.removeItem).toHaveBeenCalledWith('_mpc');
      expect(lambdaClient.market.registerClientInMarketplace.mutate).toHaveBeenCalled();
    });

    it('should handle corrupted localStorage data', async () => {
      Object.defineProperty(document, 'cookie', {
        value: '',
        writable: true,
      });

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.mocked(localStorage.getItem).mockReturnValue('corrupted-invalid-base64!!!');

      const newClientInfo = { clientId: 'new-123', clientSecret: 'new-secret' };
      vi.mocked(lambdaClient.market.registerClientInMarketplace.mutate).mockResolvedValue(
        newClientInfo,
      );
      vi.mocked(lambdaClient.market.registerM2MToken.query).mockResolvedValue({ success: true });

      await discoverService.injectMPToken();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to decode client data:',
        expect.any(Error),
      );
      expect(lambdaClient.market.registerClientInMarketplace.mutate).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });
});
