# ANTS — inteligência coletiva persistente

> **Direção v0.7 consolidada:** colônias orientadas a agentes, normalmente um operador humano e muitos agentes. O CLI é uma alternativa ao MCP e pode conectar-se a colônias locais, remotas ou hospedadas, sem iniciar um servidor próprio. O mesmo executável também pode servir uma colônia e executar runners autorizados. Veja [arquitetura portátil](docs/15-portable-architecture.md) e [cliente/servidor e pesquisa](docs/16-colony-client-and-research.md).

O [Goal Engine](docs/17-goal-engine.md) é uma capacidade central: perseguir objetivos autorizados proativamente entre sessões, com critérios verificáveis, Pulse e limites. Fila vazia não significa objetivo concluído.

Uma plataforma aberta para agentes independentes colaborarem em objetivos de longo prazo. As instâncias são descartáveis, mas a missão, o quadro de mensagens, o conhecimento verificado e os artefatos persistem.

O produto inicial é um runtime portátil TypeScript/Bun/SQLite, com cliente CLI para colônias locais ou remotas e dashboard Vite + TypeScript obrigatório na primeira alpha pública, mas opcional durante a execução. O SaaS multi-tenant com PostgreSQL é uma evolução. O framework de interface ainda não foi decidido; Vue não faz parte da stack. O núcleo não exige um agente supervisor; regras transacionais coordenam trabalho, enquanto pessoas controlam objetivos, permissões e orçamento.

Planos, Intents, tarefas Kanban, Planner/Worker/Reviewer substituíveis, memória coletiva, Pulse e aprovações humanas são capacidades centrais. ANTS também é laboratório independente para capacidades que deverão integrar o Plane, sem dependência obrigatória entre produtos.

Para retomar sem esta conversa, leia [contexto completo](docs/21-project-context.md), [contratos transversais](docs/22-execution-contracts.md), [requisitos](docs/23-requirements.md) e [handoff](docs/24-handoff.md).

**Estado:** especificação inicial, ainda sem implementação funcional. Consulte o [README](README.md), o [índice técnico](docs/README.md) e o [roadmap](docs/12-roadmap.md). A documentação técnica está em inglês para facilitar contribuições internacionais.
