import { SkillItem, SkillListItem } from '@lobechat/types';
import { and, desc, eq, ilike, inArray, or } from 'drizzle-orm';

import { NewAgentSkill, agentSkills } from '../schemas';
import { LobeChatDatabase } from '../type';

const skillItemColumns = {
  content: agentSkills.content,
  createdAt: agentSkills.createdAt,
  description: agentSkills.description,
  editorData: agentSkills.editorData,
  id: agentSkills.id,
  identifier: agentSkills.identifier,
  manifest: agentSkills.manifest,
  name: agentSkills.name,
  resources: agentSkills.resources,
  source: agentSkills.source,
  updatedAt: agentSkills.updatedAt,
  zipFileHash: agentSkills.zipFileHash,
};

const skillListColumns = {
  createdAt: agentSkills.createdAt,
  description: agentSkills.description,
  id: agentSkills.id,
  identifier: agentSkills.identifier,
  manifest: agentSkills.manifest,
  name: agentSkills.name,
  source: agentSkills.source,
  updatedAt: agentSkills.updatedAt,
  zipFileHash: agentSkills.zipFileHash,
};

export class AgentSkillModel {
  private userId: string;
  private db: LobeChatDatabase;

  constructor(db: LobeChatDatabase, userId: string) {
    this.db = db;
    this.userId = userId;
  }

  // ========== Create ==========

  create = async (data: Omit<NewAgentSkill, 'userId'>): Promise<SkillItem> => {
    const [result] = await this.db
      .insert(agentSkills)
      .values({ ...data, userId: this.userId })
      .returning(skillItemColumns);
    return result;
  };

  // ========== Read ==========

  findById = async (id: string): Promise<SkillItem | undefined> => {
    const [result] = await this.db
      .select(skillItemColumns)
      .from(agentSkills)
      .where(and(eq(agentSkills.id, id), eq(agentSkills.userId, this.userId)))
      .limit(1);
    return result;
  };

  findByIdentifier = async (identifier: string): Promise<SkillItem | undefined> => {
    const [result] = await this.db
      .select(skillItemColumns)
      .from(agentSkills)
      .where(and(eq(agentSkills.identifier, identifier), eq(agentSkills.userId, this.userId)))
      .limit(1);
    return result;
  };

  findByName = async (name: string): Promise<SkillItem | undefined> => {
    const [result] = await this.db
      .select(skillItemColumns)
      .from(agentSkills)
      .where(and(eq(agentSkills.name, name), eq(agentSkills.userId, this.userId)))
      .limit(1);
    return result;
  };

  findAll = async (): Promise<SkillListItem[]> => {
    return this.db
      .select(skillListColumns)
      .from(agentSkills)
      .where(eq(agentSkills.userId, this.userId))
      .orderBy(desc(agentSkills.updatedAt));
  };

  findByIds = async (ids: string[]): Promise<SkillItem[]> => {
    if (ids.length === 0) return [];
    return this.db
      .select(skillItemColumns)
      .from(agentSkills)
      .where(and(inArray(agentSkills.id, ids), eq(agentSkills.userId, this.userId)));
  };

  listBySource = async (source: 'builtin' | 'market' | 'user'): Promise<SkillListItem[]> => {
    return this.db
      .select(skillListColumns)
      .from(agentSkills)
      .where(and(eq(agentSkills.source, source), eq(agentSkills.userId, this.userId)))
      .orderBy(desc(agentSkills.updatedAt));
  };

  search = async (query: string): Promise<SkillListItem[]> => {
    return this.db
      .select(skillListColumns)
      .from(agentSkills)
      .where(
        and(
          eq(agentSkills.userId, this.userId),
          or(ilike(agentSkills.name, `%${query}%`), ilike(agentSkills.description, `%${query}%`)),
        ),
      )
      .orderBy(desc(agentSkills.updatedAt));
  };

  // ========== Update ==========

  update = async (id: string, data: Partial<NewAgentSkill>): Promise<SkillItem> => {
    const [result] = await this.db
      .update(agentSkills)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(agentSkills.id, id), eq(agentSkills.userId, this.userId)))
      .returning(skillItemColumns);
    return result;
  };

  // ========== Delete ==========

  delete = async (id: string): Promise<void> => {
    await this.db
      .delete(agentSkills)
      .where(and(eq(agentSkills.id, id), eq(agentSkills.userId, this.userId)));
  };
}
