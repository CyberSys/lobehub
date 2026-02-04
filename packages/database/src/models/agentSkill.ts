import { and, desc, eq, ilike, inArray, or } from 'drizzle-orm';

import { AgentSkillItem, NewAgentSkill, agentSkills } from '../schemas';
import { LobeChatDatabase } from '../type';

export class AgentSkillModel {
  private userId: string;
  private db: LobeChatDatabase;

  constructor(db: LobeChatDatabase, userId: string) {
    this.db = db;
    this.userId = userId;
  }

  // ========== CRUD ==========

  create = async (data: Omit<NewAgentSkill, 'userId'>): Promise<AgentSkillItem> => {
    const [result] = await this.db
      .insert(agentSkills)
      .values({ ...data, userId: this.userId })
      .returning();
    return result;
  };

  findById = async (id: string): Promise<AgentSkillItem | undefined> => {
    return this.db.query.agentSkills.findFirst({
      where: and(eq(agentSkills.id, id), eq(agentSkills.userId, this.userId)),
    });
  };

  findByIdentifier = async (identifier: string): Promise<AgentSkillItem | undefined> => {
    return this.db.query.agentSkills.findFirst({
      where: and(eq(agentSkills.identifier, identifier), eq(agentSkills.userId, this.userId)),
    });
  };

  findAll = async (): Promise<AgentSkillItem[]> => {
    return this.db.query.agentSkills.findMany({
      orderBy: [desc(agentSkills.updatedAt)],
      where: eq(agentSkills.userId, this.userId),
    });
  };

  findByIds = async (ids: string[]): Promise<AgentSkillItem[]> => {
    if (ids.length === 0) return [];
    return this.db.query.agentSkills.findMany({
      where: and(inArray(agentSkills.id, ids), eq(agentSkills.userId, this.userId)),
    });
  };

  update = async (id: string, data: Partial<NewAgentSkill>): Promise<AgentSkillItem> => {
    const [result] = await this.db
      .update(agentSkills)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(agentSkills.id, id), eq(agentSkills.userId, this.userId)))
      .returning();
    return result;
  };

  delete = async (id: string): Promise<void> => {
    await this.db
      .delete(agentSkills)
      .where(and(eq(agentSkills.id, id), eq(agentSkills.userId, this.userId)));
  };

  // ========== 查询 ==========

  listBySource = async (source: 'builtin' | 'market' | 'user'): Promise<AgentSkillItem[]> => {
    return this.db.query.agentSkills.findMany({
      orderBy: [desc(agentSkills.updatedAt)],
      where: and(eq(agentSkills.source, source), eq(agentSkills.userId, this.userId)),
    });
  };

  search = async (query: string): Promise<AgentSkillItem[]> => {
    return this.db.query.agentSkills.findMany({
      orderBy: [desc(agentSkills.updatedAt)],
      where: and(
        eq(agentSkills.userId, this.userId),
        or(ilike(agentSkills.name, `%${query}%`), ilike(agentSkills.description, `%${query}%`)),
      ),
    });
  };
}
