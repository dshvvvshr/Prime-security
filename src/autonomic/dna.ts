/**
 * Autonomic Computing - Digital DNA
 * 
 * Represents the system's blueprint that can be used to reconstruct,
 * repair, and evolve the system. Implements the "digital DNA" concept
 * from the architecture.
 */

export interface SystemBlueprint {
  version: string;
  coreDirective: CoreDirectiveReference;
  modules: ModuleDefinition[];
  configuration: SystemConfiguration;
  policies: Policy[];
}

export interface CoreDirectiveReference {
  version: string;
  checksum: string;
  url: string;
}

export interface ModuleDefinition {
  name: string;
  version: string;
  type: 'core' | 'extension' | 'plugin';
  repository?: string;
  configuration?: Record<string, unknown>;
  dependencies?: string[];
}

export interface SystemConfiguration {
  environment: 'development' | 'staging' | 'production';
  features: Record<string, boolean>;
  limits: ResourceLimits;
}

export interface ResourceLimits {
  maxMemoryMB?: number;
  maxCPUPercent?: number;
  maxConnections?: number;
  requestRateLimit?: number;
}

export interface Policy {
  name: string;
  type: 'security' | 'performance' | 'governance';
  enabled: boolean;
  rules: PolicyRule[];
}

export interface PolicyRule {
  condition: string;
  action: string;
  parameters?: Record<string, unknown>;
}

/**
 * DNA Manager - handles system blueprint
 */
export class DNAManager {
  private blueprint: SystemBlueprint | null = null;

  /**
   * Load system blueprint
   */
  load(blueprint: SystemBlueprint): void {
    this.validateBlueprint(blueprint);
    this.blueprint = blueprint;
  }

  /**
   * Get current blueprint
   */
  getBlueprint(): SystemBlueprint | null {
    return this.blueprint;
  }

  /**
   * Validate blueprint structure
   */
  private validateBlueprint(blueprint: SystemBlueprint): void {
    if (!blueprint.version) {
      throw new Error('Blueprint must have a version');
    }

    if (!blueprint.coreDirective) {
      throw new Error('Blueprint must reference Core Directive');
    }

    if (!Array.isArray(blueprint.modules)) {
      throw new Error('Blueprint must have modules array');
    }

    if (!blueprint.configuration) {
      throw new Error('Blueprint must have configuration');
    }
  }

  /**
   * Generate a minimal viable blueprint
   */
  static createMinimal(): SystemBlueprint {
    return {
      version: '0.1.0',
      coreDirective: {
        version: '1.0.0',
        checksum: '',
        url: 'file://CORE_DIRECTIVE.md',
      },
      modules: [
        {
          name: 'core-security',
          version: '0.1.0',
          type: 'core',
        },
        {
          name: 'module-registry',
          version: '0.1.0',
          type: 'core',
        },
      ],
      configuration: {
        environment: 'development',
        features: {
          selfHealing: false,
          autoUpdate: false,
        },
        limits: {
          maxMemoryMB: 512,
          maxCPUPercent: 80,
        },
      },
      policies: [
        {
          name: 'core-directive-compliance',
          type: 'governance',
          enabled: true,
          rules: [
            {
              condition: 'on_module_load',
              action: 'validate_compliance',
            },
          ],
        },
      ],
    };
  }

  /**
   * Export blueprint as JSON
   */
  export(): string {
    if (!this.blueprint) {
      throw new Error('No blueprint loaded');
    }
    return JSON.stringify(this.blueprint, null, 2);
  }

  /**
   * Import blueprint from JSON
   */
  import(json: string): void {
    const blueprint = JSON.parse(json) as SystemBlueprint;
    this.load(blueprint);
  }
}
