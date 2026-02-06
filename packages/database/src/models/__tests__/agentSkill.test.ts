// @vitest-environment node
import { SkillManifest } from '@lobechat/types';
import { eq } from 'drizzle-orm';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { getTestDB } from '../../core/getTestDB';
import { agentSkills, users } from '../../schemas';
import { LobeChatDatabase } from '../../type';
import { AgentSkillModel } from '../agentSkill';

const serverDB: LobeChatDatabase = await getTestDB();

const userId = 'agent-skill-model-test-user-id';
const agentSkillModel = new AgentSkillModel(serverDB, userId);

// Helper to create valid manifest for tests
const createManifest = (overrides?: Partial<SkillManifest>): SkillManifest => ({
  description: 'Test skill description',
  name: 'Test Skill',
  ...overrides,
});

beforeEach(async () => {
  await serverDB.delete(users);
  await serverDB.insert(users).values([{ id: userId }]);
});

afterEach(async () => {
  await serverDB.delete(users).where(eq(users.id, userId));
});

describe('AgentSkillModel', () => {
  describe('create', () => {
    it('should create a new agent skill', async () => {
      const params = {
        name: 'Test Skill',
        description: 'A test skill',
        identifier: 'test.skill',
        source: 'user' as const,
        manifest: createManifest({ version: '1.0.0' }),
        content: '# Test Skill Content',
      };

      const skill = await agentSkillModel.create(params);

      expect(skill).toMatchObject(params);
      expect(skill.id).toBeDefined();
    });
  });

  describe('delete', () => {
    it('should delete an agent skill by id', async () => {
      const { id } = await serverDB
        .insert(agentSkills)
        .values({
          name: 'To Delete',
          identifier: 'to.delete',
          source: 'user',
          manifest: createManifest(),
          userId,
        })
        .returning()
        .then((res) => res[0]);

      await agentSkillModel.delete(id);

      const skill = await serverDB.query.agentSkills.findFirst({
        where: eq(agentSkills.id, id),
      });
      expect(skill).toBeUndefined();
    });
  });

  describe('findById', () => {
    it('should find an agent skill by id', async () => {
      const { id } = await serverDB
        .insert(agentSkills)
        .values({
          name: 'Find Me',
          identifier: 'find.me',
          source: 'user',
          manifest: createManifest(),
          userId,
        })
        .returning()
        .then((res) => res[0]);

      const skill = await agentSkillModel.findById(id);
      expect(skill).toBeDefined();
      expect(skill?.id).toBe(id);
    });

    it('should return undefined for non-existent id', async () => {
      const skill = await agentSkillModel.findById('non-existent-id');
      expect(skill).toBeUndefined();
    });
  });

  describe('findByIdentifier', () => {
    it('should find an agent skill by identifier', async () => {
      await serverDB.insert(agentSkills).values({
        name: 'By Identifier',
        identifier: 'by.identifier',
        source: 'user',
        manifest: createManifest(),
        userId,
      });

      const skill = await agentSkillModel.findByIdentifier('by.identifier');
      expect(skill).toBeDefined();
      expect(skill?.identifier).toBe('by.identifier');
    });
  });

  describe('findAll', () => {
    it('should find all agent skills for user', async () => {
      await serverDB.insert(agentSkills).values([
        {
          name: 'Skill 1',
          identifier: 'skill.1',
          source: 'user',
          manifest: createManifest(),
          userId,
        },
        {
          name: 'Skill 2',
          identifier: 'skill.2',
          source: 'market',
          manifest: createManifest(),
          userId,
        },
      ]);

      const skills = await agentSkillModel.findAll();
      expect(skills).toHaveLength(2);
    });
  });

  describe('findByIds', () => {
    it('should find agent skills by ids', async () => {
      const inserted = await serverDB
        .insert(agentSkills)
        .values([
          {
            name: 'Skill A',
            identifier: 'skill.a',
            source: 'user',
            manifest: createManifest(),
            userId,
          },
          {
            name: 'Skill B',
            identifier: 'skill.b',
            source: 'user',
            manifest: createManifest(),
            userId,
          },
          {
            name: 'Skill C',
            identifier: 'skill.c',
            source: 'user',
            manifest: createManifest(),
            userId,
          },
        ])
        .returning();

      const ids = [inserted[0].id, inserted[2].id];
      const skills = await agentSkillModel.findByIds(ids);

      expect(skills).toHaveLength(2);
    });

    it('should return empty array for empty ids', async () => {
      const skills = await agentSkillModel.findByIds([]);
      expect(skills).toHaveLength(0);
    });
  });

  describe('update', () => {
    it('should update an agent skill', async () => {
      const { id } = await serverDB
        .insert(agentSkills)
        .values({
          name: 'Original Name',
          identifier: 'original',
          source: 'user',
          manifest: createManifest(),
          userId,
        })
        .returning()
        .then((res) => res[0]);

      await agentSkillModel.update(id, { name: 'Updated Name' });

      const updated = await serverDB.query.agentSkills.findFirst({
        where: eq(agentSkills.id, id),
      });
      expect(updated?.name).toBe('Updated Name');
    });
  });

  describe('listBySource', () => {
    it('should list agent skills by source', async () => {
      await serverDB.insert(agentSkills).values([
        {
          name: 'User Skill',
          identifier: 'user.skill',
          source: 'user',
          manifest: createManifest(),
          userId,
        },
        {
          name: 'Market Skill',
          identifier: 'market.skill',
          source: 'market',
          manifest: createManifest(),
          userId,
        },
        {
          name: 'Builtin Skill',
          identifier: 'builtin.skill',
          source: 'builtin',
          manifest: createManifest(),
          userId,
        },
      ]);

      const userSkills = await agentSkillModel.listBySource('user');
      expect(userSkills).toHaveLength(1);
      expect(userSkills[0].source).toBe('user');

      const marketSkills = await agentSkillModel.listBySource('market');
      expect(marketSkills).toHaveLength(1);
    });
  });

  describe('search', () => {
    it('should search agent skills by name', async () => {
      await serverDB.insert(agentSkills).values([
        {
          name: 'Coding Wizard',
          identifier: 'coding',
          source: 'user',
          manifest: createManifest(),
          userId,
        },
        {
          name: 'Writing Helper',
          identifier: 'writing',
          source: 'user',
          manifest: createManifest(),
          userId,
        },
      ]);

      const results = await agentSkillModel.search('Coding');
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Coding Wizard');
    });

    it('should search agent skills by description', async () => {
      await serverDB.insert(agentSkills).values([
        {
          name: 'Skill A',
          description: 'Helps with coding tasks',
          identifier: 'a',
          source: 'user',
          manifest: createManifest(),
          userId,
        },
        {
          name: 'Skill B',
          description: 'Helps with writing',
          identifier: 'b',
          source: 'user',
          manifest: createManifest(),
          userId,
        },
      ]);

      const results = await agentSkillModel.search('coding');
      expect(results).toHaveLength(1);
    });
  });
});
