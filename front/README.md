# SiteBase

Projet Angular 21 **zoneless** généré avec [Angular CLI](https://github.com/angular/angular-cli) v21.1.4.

| Stack | Choix |
|---|---|
| Framework | Angular 21 (standalone, zoneless) |
| Tests unitaires | [Vitest](https://vitest.dev/) |
| Styles | SCSS |
| Package manager | npm |

## Commandes de développement

```bash
# Serveur de développement (http://localhost:4200)
ng serve

# Build de production
ng build

# Tests unitaires
ng test

# Scaffolding (composant, service, directive, pipe…)
ng generate component mon-composant
```

## Utiliser Claude Code avec ce projet

Ce projet est configuré pour fonctionner avec [Claude Code](https://docs.anthropic.com/en/docs/claude-code) grâce au serveur MCP Angular intégré à Angular CLI.

### Prérequis

- [Node.js](https://nodejs.org/) v24+
- Angular CLI v21+ installé globalement :
  ```bash
  npm install -g @angular/cli@latest
  ```
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) installé :
  ```bash
  npm install -g @anthropic-ai/claude-code
  ```

### Configuration MCP Angular

Le serveur MCP (Model Context Protocol) Angular permet à Claude Code de comprendre et manipuler le projet de manière optimale. Il est intégré directement dans Angular CLI 21+.

#### Ajouter le serveur MCP à Claude Code

A la racine du projet, exécuter :

```bash
claude mcp add angular -- ng mcp
```

Cette commande enregistre le serveur MCP Angular dans la configuration locale de Claude Code.

> **Note :** Le projet inclut déjà la configuration MCP pour VS Code dans `.vscode/mcp.json`. Si vous utilisez VS Code avec l'extension Claude, le serveur est automatiquement disponible.

#### Outils MCP disponibles

Le serveur `ng mcp` expose les outils suivants :

| Outil | Description |
|---|---|
| `list_projects` | Découvre la structure du workspace (projets, types, chemins, version Angular, framework de tests) |
| `get_best_practices` | Récupère le guide des bonnes pratiques Angular adapté à la version du projet |
| `search_documentation` | Recherche dans la documentation officielle angular.dev |
| `find_examples` | Recherche des exemples de code officiels pour les features modernes |
| `onpush_zoneless_migration` | Analyse et guide la migration vers OnPush / zoneless |
| `ai_tutor` | Lance un tuteur Angular interactif guidé |

#### Options du serveur MCP

```bash
# Mode lecture seule (pas de modification de fichiers)
claude mcp add angular -- ng mcp --read-only

# Mode local uniquement (pas d'accès internet)
claude mcp add angular -- ng mcp --local-only
```

### Fichiers de configuration IA

Le projet inclut des fichiers de configuration pour optimiser l'assistance IA :

| Fichier | Rôle |
|---|---|
| `.claude/CLAUDE.md` | Instructions et bonnes pratiques Angular pour Claude Code |
| `.vscode/mcp.json` | Configuration MCP pour VS Code |

### Utilisation au quotidien

Une fois le MCP configuré, lancez simplement Claude Code depuis la racine du projet :

```bash
claude
```

Claude aura automatiquement accès aux outils Angular et pourra :

- **Analyser la structure du projet** : comprendre les composants, services, routes
- **Générer du code conforme** : en suivant les bonnes pratiques Angular 21 (signals, standalone, zoneless, control flow `@if`/`@for`/`@switch`)
- **Rechercher la documentation** : accéder à angular.dev directement depuis la conversation
- **Trouver des exemples** : consulter la base d'exemples officiels pour les features modernes
- **Guider les migrations** : accompagner le passage vers OnPush et zoneless

### Bonnes pratiques avec Claude Code sur ce projet

1. **Toujours travailler depuis la racine du projet** pour que Claude détecte le `angular.json`
2. **Demander les bonnes pratiques avant de coder** : Claude chargera automatiquement le guide adapté à la version Angular du projet
3. **Utiliser les exemples officiels** : demandez "montre-moi un exemple de signal input" et Claude interrogera la base d'exemples
4. **Vérifier la version** : Claude adapte ses réponses à la version Angular détectée dans le projet
