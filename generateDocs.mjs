// generateDocs.mjs
import { parse } from 'react-docgen';
import { createRequire } from 'module';
import glob from 'glob';
import fs from 'fs';
import path from 'path';
import ts from 'typescript';

// Create a CommonJS `require` for modules not available as ESM
const require = createRequire(import.meta.url);

/**
 * Configuration
 */

// Define the directories and file patterns to include
const CONFIG = {
  components: [
    'src/components/**/*.tsx',
    'components/**/*.tsx',
    'src/app/**/*.tsx', // Assuming app directory contains components as well
  ],
  hooks: [
    'src/hooks/**/*.ts',
    'hooks/**/*.ts',
  ],
  apiRoutes: [
    'src/app/api/**/*.ts',
  ],
};

// Define the output file
const OUTPUT_DIR = path.join(process.cwd(), 'docs');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'project-docs.md');

/**
 * Utility Functions
 */

// Ensure the output directory exists
function ensureOutputDir() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
}

// Parse React components using React Docgen
function parseReactComponent(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const componentInfo = parse(content);
    return {
      file: path.relative(process.cwd(), filePath),
      ...componentInfo,
    };
  } catch (error) {
    console.warn(`Warning: Could not parse React component ${filePath}. ${error.message}`);
    return null;
  }
}

// Extract JSDoc comments from TypeScript files (for hooks and API routes)
function extractJsDoc(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const sourceFile = ts.createSourceFile(
    filePath,
    fileContent,
    ts.ScriptTarget.Latest,
    true
  );

  const jsDocs = [];

  function visit(node) {
    if (ts.getJSDocTags(node).length > 0) {
      const jsDoc = ts.getJSDocCommentsAndTags(node)
        .map(comment => comment.getText(sourceFile))
        .join('\n');
      jsDocs.push(jsDoc.replace(/\/\*\*|\*\//g, '').trim());
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return jsDocs.join('\n\n') || 'No description provided.';
}

// Parse custom hooks
function parseHook(filePath) {
  try {
    const description = extractJsDoc(filePath);
    const hookName = path.basename(filePath, path.extname(filePath));
    return {
      file: path.relative(process.cwd(), filePath),
      displayName: hookName,
      description,
    };
  } catch (error) {
    console.warn(`Warning: Could not parse hook ${filePath}. ${error.message}`);
    return null;
  }
}

// Parse API routes
function parseApiRoute(filePath) {
  try {
    const description = extractJsDoc(filePath);
    // Derive the API endpoint path from file path
    const relativePath = path.relative(path.join(process.cwd(), 'src', 'app', 'api'), filePath);
    let routePath = '/' + relativePath.replace(/\\/g, '/').replace(/\.ts$/, '');
    // Remove '/route' if present
    routePath = routePath.replace(/\/route$/, '');
    return {
      file: path.relative(process.cwd(), filePath),
      route: routePath,
      description,
    };
  } catch (error) {
    console.warn(`Warning: Could not parse API route ${filePath}. ${error.message}`);
    return null;
  }
}

// Convert props object to Markdown table
function propsToMarkdown(props) {
  if (!props) return 'No props defined.\n';
  const headers = '| Name | Type | Default | Description |\n| ---- | ---- | ------- | ----------- |';
  const rows = Object.keys(props).map((prop) => {
    const { type, defaultValue, description } = props[prop];
    return `| ${prop} | ${type ? type.name : '—'} | ${defaultValue ? defaultValue.value : '—'} | ${description || '—'} |`;
  }).join('\n');
  return `${headers}\n${rows}`;
}

// Generate Markdown section for a React component
function generateComponentMarkdown(component) {
  return `
## ${component.displayName || component.file}

**File:** \`${component.file}\`

### Description
${component.description || 'No description provided.'}

### Props
${propsToMarkdown(component.props)}

### Example Usage
\`\`\`jsx
// Example usage of ${component.displayName || 'Component'}
import ${component.displayName || 'Component'} from './${path.basename(component.file, path.extname(component.file))}';

const Example = () => (
  <${component.displayName || 'Component'} />
);

export default Example;
\`\`\`

---
`;
}

// Generate Markdown section for a custom hook
function generateHookMarkdown(hook) {
  return `
## ${hook.displayName}

**File:** \`${hook.file}\`

### Description
${hook.description}

### Example Usage
\`\`\`typescript
// Example usage of ${hook.displayName}
import { ${hook.displayName} } from './${path.basename(hook.file, path.extname(hook.file))}';

const ExampleComponent = () => {
  const auth = ${hook.displayName}();
  // Use the auth object
};
\`\`\`

---
`;
}

// Generate Markdown section for an API route
function generateApiRouteMarkdown(apiRoute) {
  return `
### \`${apiRoute.route}\`

**File:** \`${apiRoute.file}\`

**Description:**
${apiRoute.description}

---
`;
}

// Generate the Application Flow Diagram using Mermaid
function generateMermaidDiagram() {
  return `
## Application Flow Diagram

\`\`\`mermaid
graph TD
  A[Client Request] --> B[Next.js Server]
  B --> C[API Routes]
  B --> D[Pages and Components]
  C --> E[Database (Prisma)]
  D --> F[React Components]
  F --> G[Custom Hooks]
  F --> H[Context Providers]
  H --> F
  G --> H
\`\`\`

---
`;
}

/**
 * Markdown Generators for Types (optional, as per previous answer)
 */

function parseType(filePath) {
  try {
    const description = extractJsDoc(filePath);
    const typeName = path.basename(filePath, path.extname(filePath));
    return {
      file: path.relative(process.cwd(), filePath),
      displayName: typeName,
      description,
    };
  } catch (error) {
    console.warn(`Warning: Could not parse type ${filePath}. ${error.message}`);
    return null;
  }
}

function generateTypeMarkdown(type) {
  return `
## ${type.displayName}

**File:** \`${type.file}\`

### Description
${type.description}

---
`;
}

/**
 * Main Documentation Generation Function
 */
function generateDocumentation() {
  ensureOutputDir();

  let allDocs = '# Project Documentation\n\n';

  // Document React Components
  allDocs += '## Components\n\n';
  CONFIG.components.forEach((pattern) => {
    const files = glob.sync(pattern, { absolute: true });
    files.forEach((file) => {
      const component = parseReactComponent(file);
      if (component && component.displayName) {
        allDocs += generateComponentMarkdown(component);
      }
    });
  });

  // Document Custom Hooks
  allDocs += '## Custom Hooks\n\n';
  CONFIG.hooks.forEach((pattern) => {
    const files = glob.sync(pattern, { absolute: true });
    files.forEach((file) => {
      const hook = parseHook(file);
      if (hook && hook.displayName) {
        allDocs += generateHookMarkdown(hook);
      }
    });
  });

  // Document API Routes
  allDocs += '## API Routes\n\n';
  CONFIG.apiRoutes.forEach((pattern) => {
    const files = glob.sync(pattern, { absolute: true });
    files.forEach((file) => {
      const apiRoute = parseApiRoute(file);
      if (apiRoute && apiRoute.route) {
        allDocs += generateApiRouteMarkdown(apiRoute);
      }
    });
  });

  // Document Types (optional)
  // Uncomment if you want to document types
  /*
  allDocs += '## Types\n\n';
  CONFIG.types.forEach((pattern) => {
    const files = glob.sync(pattern, { absolute: true });
    files.forEach((file) => {
      const type = parseType(file);
      if (type && type.displayName) {
        allDocs += generateTypeMarkdown(type);
      }
    });
  });
  */

  // Add Application Flow Diagram
  allDocs += generateMermaidDiagram();

  // Write to Markdown file
  const outputPath = path.join(OUTPUT_FILE);
  fs.writeFileSync(outputPath, allDocs, 'utf-8');
  console.log(`Documentation generated successfully at ${outputPath}`);
}

// Execute the documentation generation
generateDocumentation();

