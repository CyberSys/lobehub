import {
  ActionIcon,
  Block,
  DropdownMenuPopup,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownMenuSubmenuRoot,
  DropdownMenuSubmenuTrigger,
  Flexbox,
  Icon,
  menuSharedStyles,
} from '@lobehub/ui';
import { cssVar, cx } from 'antd-style';
import { LucideArrowRight, LucideBolt } from 'lucide-react';
import { type ReactNode, memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import urlJoin from 'url-join';

import { ModelItemRender, ProviderItemRender } from '@/components/ModelSelect';

import { styles } from '../../styles';
import type { ListItem } from '../../types';
import { menuKey } from '../../utils';
import ModelDetailPanel from '../ModelDetailPanel';
import { MultipleProvidersModelItem } from './MultipleProvidersModelItem';
import { SingleProviderModelItem } from './SingleProviderModelItem';

interface ListItemRendererProps {
  activeKey: string;
  extraControls?: (modelId: string, providerId: string) => ReactNode;
  isScrolling: boolean;
  item: ListItem;
  newLabel: string;
  onClose: () => void;
  onModelChange: (modelId: string, providerId: string) => Promise<void>;
}

export const ListItemRenderer = memo<ListItemRendererProps>(
  ({ activeKey, extraControls, isScrolling, item, newLabel, onModelChange, onClose }) => {
    const { t } = useTranslation('components');
    const navigate = useNavigate();
    const [detailOpen, setDetailOpen] = useState(false);

    useEffect(() => {
      if (isScrolling) {
        setDetailOpen(false);
      }
    }, [isScrolling]);

    switch (item.type) {
      case 'no-provider': {
        return (
          <Block
            className={styles.menuItem}
            clickable
            gap={8}
            horizontal
            key="no-provider"
            onClick={() => navigate('/settings/provider/all')}
            style={{ color: cssVar.colorTextTertiary }}
            variant={'borderless'}
          >
            {t('ModelSwitchPanel.emptyProvider')}
            <Icon icon={LucideArrowRight} />
          </Block>
        );
      }

      case 'group-header': {
        return (
          <Flexbox
            className={styles.groupHeader}
            horizontal
            justify="space-between"
            key={`header-${item.provider.id}`}
            paddingBlock={'12px 4px'}
            paddingInline={'12px 8px'}
          >
            <ProviderItemRender
              logo={item.provider.logo}
              name={item.provider.name}
              provider={item.provider.id}
              source={item.provider.source}
            />
            <ActionIcon
              className="settings-icon"
              icon={LucideBolt}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const url = urlJoin('/settings/provider', item.provider.id || 'all');
                if (e.ctrlKey || e.metaKey) {
                  window.open(url, '_blank');
                } else {
                  navigate(url);
                }
              }}
              size={'small'}
              title={t('ModelSwitchPanel.goToSettings')}
            />
          </Flexbox>
        );
      }

      case 'empty-model': {
        return (
          <Flexbox
            className={styles.menuItem}
            gap={8}
            horizontal
            key={`empty-${item.provider.id}`}
            onClick={() => navigate(`/settings/provider/${item.provider.id}`)}
            style={{ color: cssVar.colorTextTertiary }}
          >
            {t('ModelSwitchPanel.emptyModel')}
            <Icon icon={LucideArrowRight} />
          </Flexbox>
        );
      }

      case 'provider-model-item': {
        const key = menuKey(item.provider.id, item.model.id);
        const isActive = key === activeKey;

        return (
          <Flexbox style={{ marginBlock: 1, marginInline: 4 }}>
            <DropdownMenuSubmenuRoot onOpenChange={setDetailOpen} open={detailOpen}>
              <DropdownMenuSubmenuTrigger
                className={cx(menuSharedStyles.item, isActive && styles.menuItemActive)}
                onClick={async () => {
                  setDetailOpen(false);
                  onModelChange(item.model.id, item.provider.id);
                  onClose();
                }}
                style={{ paddingBlock: 8, paddingInline: 8 }}
              >
                <ModelItemRender
                  {...item.model}
                  {...item.model.abilities}
                  newBadgeLabel={newLabel}
                  showInfoTag
                />
              </DropdownMenuSubmenuTrigger>
              <DropdownMenuPortal>
                <DropdownMenuPositioner
                  anchor={null}
                  placement="right"
                  sideOffset={8}
                >
                  <DropdownMenuPopup className={styles.detailPopup}>
                    <ModelDetailPanel model={item.model} />
                    {extraControls?.(item.model.id, item.provider.id)}
                  </DropdownMenuPopup>
                </DropdownMenuPositioner>
              </DropdownMenuPortal>
            </DropdownMenuSubmenuRoot>
          </Flexbox>
        );
      }

      case 'model-item-single': {
        const singleProvider = item.data.providers[0];
        const key = menuKey(singleProvider.id, item.data.model.id);
        const isActive = key === activeKey;

        return (
          <Flexbox style={{ marginBlock: 1, marginInline: 4 }}>
            <DropdownMenuSubmenuRoot onOpenChange={setDetailOpen} open={detailOpen}>
              <DropdownMenuSubmenuTrigger
                className={cx(menuSharedStyles.item, isActive && styles.menuItemActive)}
                onClick={async () => {
                  setDetailOpen(false);
                  onModelChange(item.data.model.id, singleProvider.id);
                  onClose();
                }}
                style={{ paddingBlock: 8, paddingInline: 8 }}
              >
                <SingleProviderModelItem data={item.data} newLabel={newLabel} />
              </DropdownMenuSubmenuTrigger>
              <DropdownMenuPortal>
                <DropdownMenuPositioner
                  anchor={null}
                  placement="right"
                  sideOffset={8}
                >
                  <DropdownMenuPopup className={styles.detailPopup}>
                    <ModelDetailPanel model={item.data.model} />
                    {extraControls?.(item.data.model.id, singleProvider.id)}
                  </DropdownMenuPopup>
                </DropdownMenuPositioner>
              </DropdownMenuPortal>
            </DropdownMenuSubmenuRoot>
          </Flexbox>
        );
      }

      case 'model-item-multiple': {
        return (
          <Flexbox key={item.data.displayName} style={{ marginBlock: 1, marginInline: 4 }}>
            <MultipleProvidersModelItem
              activeKey={activeKey}
              data={item.data}
              extraControls={extraControls}
              isScrolling={isScrolling}
              newLabel={newLabel}
              onClose={onClose}
              onModelChange={onModelChange}
            />
          </Flexbox>
        );
      }

      default: {
        return null;
      }
    }
  },
);

ListItemRenderer.displayName = 'ListItemRenderer';
