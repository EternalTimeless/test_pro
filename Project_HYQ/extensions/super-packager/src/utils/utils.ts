/**
 * 工具类
 */
export class Utils {
    /**
     * 将项目相对路径(project://)转换为绝对路径
     * @param path 包含project://前缀的路径
     * @returns 转换后的绝对路径
     */
    static convertProjectPath(path: string): string {
        const projectPath = Editor.Project.path;
        return path.replace('project://', projectPath + '/');
    }

    /**
     * 读取文件内容
     * @param filePath 文件路径
     * @returns 文件内容字符串
     */
    static async readFile(filePath: string): Promise<string> {
        try {
            const fs = require('fs').promises;
            const content = await fs.readFile(filePath, 'utf-8');
            return content;
        } catch (error) {
            console.error('读取文件失败:', error);
            throw error;
        }
    }
}

/**
 * 命名规则配置项
 */
export interface NamingConfigItem {
    /** 配置项键名 */
    key: string;
    /** 配置项显示名称 */
    label: string;
    /** 配置项值 */
    value: string;
    /** 是否为必填项 */
    required: boolean;
    /** 配置项描述 */
    description?: string;
}

/**
 * 命名规则配置
 */
export interface NamingRuleConfig {
    /** 配置名称 */
    name: string;
    /** 普通版本命名模板 */
    normalTemplate: string;
    /** TCE版本命名模板 */
    tceTemplate: string;
    /** 配置项列表 */
    configItems: NamingConfigItem[];
    /** 分隔符 */
    separator: string;
}

/**
 * 默认命名规则配置文件结构
 */
export interface DefaultNamingRulesConfig {
    /** 配置文件版本 */
    version: string;
    /** 配置文件描述 */
    description: string;
    /** 默认规则列表 */
    defaultRules: NamingRuleConfig[];
}

/**
 * 默认命名规则配置
 */
export const DEFAULT_NAMING_CONFIG: NamingRuleConfig = {
    name: '默认命名规则',
    normalTemplate: '{gameAbbr}{separator}{packageDate}{separator}{adName}{separator}{plannerAbbr}{separator}{companyPrefix}{separator}{platformName}{separator}ALL',
    tceTemplate: '{gameAbbr}{separator}{packageDate}{separator}{adName}TCE{separator}{plannerAbbr}{separator}{companyPrefix}{separator}{platformName}{separator}ALL',
    separator: '_',
    configItems: [
        {
            key: 'gameAbbr',
            label: '游戏名称缩写',
            value: '',
            required: true,
            description: '例如: MF, TH, LW'
        },
        {
            key: 'packageDate',
            label: '打包日期',
            value: '',
            required: true,
            description: 'YYYYMMDD格式'
        },
        {
            key: 'adName',
            label: '试玩广告名称',
            value: '',
            required: true,
            description: '试玩广告的名称'
        },
        {
            key: 'plannerAbbr',
            label: '策划名字缩写',
            value: '',
            required: true,
            description: '甲方策划名字缩写'
        },
        {
            key: 'companyPrefix',
            label: '公司前缀',
            value: 'RBN',
            required: false,
            description: '公司前缀标识'
        },
        {
            key: 'platformName',
            label: '平台名称',
            value: '',
            required: true,
            description: '自动根据选择的平台生成'
        }
    ]
};

/**
 * 命名规则管理器
 */
export class NamingRuleManager {
    private static readonly STORAGE_KEY = 'super-packager-naming-rules';
    private static readonly CURRENT_RULE_KEY = 'super-packager-current-naming-rule';
    private static readonly DEFAULT_CONFIG_PATH = 'configs/defaultNamingRules.json';

    /**
     * 从配置文件加载默认命名规则
     */
    static async loadDefaultRulesFromConfig(): Promise<NamingRuleConfig[]> {
        try {
            const configPath = Utils.convertProjectPath(`project://extensions/super-packager/${NamingRuleManager.DEFAULT_CONFIG_PATH}`);
            const configContent = await Utils.readFile(configPath);
            const config: DefaultNamingRulesConfig = JSON.parse(configContent);
            
            if (config.defaultRules && Array.isArray(config.defaultRules)) {
                return config.defaultRules;
            }
            
            console.warn('配置文件中没有找到有效的默认规则，使用内置默认规则');
            return [DEFAULT_NAMING_CONFIG];
        } catch (error) {
            console.warn('加载默认规则配置文件失败，使用内置默认规则:', error);
            return [DEFAULT_NAMING_CONFIG];
        }
    }

    /**
     * 获取所有命名规则
     */
    static async getAllRules(): Promise<NamingRuleConfig[]> {
        try {
            const rules = await Editor.Profile.getConfig('super-packager', NamingRuleManager.STORAGE_KEY);
            if (rules && Array.isArray(rules) && rules.length > 0) {
                return rules;
            }
            
            // 如果没有保存的规则，尝试从配置文件加载默认规则
            const defaultRules = await NamingRuleManager.loadDefaultRulesFromConfig();
            
            // 保存默认规则到配置中
            await NamingRuleManager.saveAllRules(defaultRules);
            
            return defaultRules;
        } catch (error) {
            console.error('获取命名规则失败:', error);
            return [DEFAULT_NAMING_CONFIG];
        }
    }

    /**
     * 保存所有命名规则
     */
    static async saveAllRules(rules: NamingRuleConfig[]): Promise<void> {
        try {
            await Editor.Profile.setConfig('super-packager', NamingRuleManager.STORAGE_KEY, rules);
        } catch (error) {
            console.error('保存命名规则失败:', error);
            throw error;
        }
    }

    /**
     * 获取当前使用的命名规则
     */
    static async getCurrentRule(): Promise<NamingRuleConfig> {
        try {
            const currentName = await Editor.Profile.getConfig('super-packager', NamingRuleManager.CURRENT_RULE_KEY);
            const allRules = await NamingRuleManager.getAllRules();
            
            if (currentName) {
                const rule = allRules.find(r => r.name === currentName);
                if (rule) return rule;
            }
            
            return allRules[0] || DEFAULT_NAMING_CONFIG;
        } catch (error) {
            console.error('获取当前命名规则失败:', error);
            return DEFAULT_NAMING_CONFIG;
        }
    }

    /**
     * 设置当前使用的命名规则
     */
    static async setCurrentRule(ruleName: string): Promise<void> {
        try {
            await Editor.Profile.setConfig('super-packager', NamingRuleManager.CURRENT_RULE_KEY, ruleName);
        } catch (error) {
            console.error('设置当前命名规则失败:', error);
            throw error;
        }
    }

    /**
     * 添加新的命名规则
     */
    static async addRule(rule: NamingRuleConfig): Promise<void> {
        const rules = await NamingRuleManager.getAllRules();
        const existingIndex = rules.findIndex(r => r.name === rule.name);
        
        if (existingIndex >= 0) {
            rules[existingIndex] = rule;
        } else {
            rules.push(rule);
        }
        
        await NamingRuleManager.saveAllRules(rules);
    }

    /**
     * 删除命名规则
     */
    static async deleteRule(ruleName: string): Promise<void> {
        const rules = await NamingRuleManager.getAllRules();
        const filteredRules = rules.filter(r => r.name !== ruleName);
        
        if (filteredRules.length === 0) {
            throw new Error('不能删除所有命名规则，至少需要保留一个');
        }
        
        await NamingRuleManager.saveAllRules(filteredRules);
        
        // 如果删除的是当前规则，切换到第一个规则
        const currentRule = await NamingRuleManager.getCurrentRule();
        if (currentRule.name === ruleName) {
            await NamingRuleManager.setCurrentRule(filteredRules[0].name);
        }
    }

    /**
     * 根据模板和配置项生成文件名
     */
    static generateFileName(template: string, configItems: NamingConfigItem[], separator: string, platform: string, extraData: any = {}): string {
        let result = template;
        
        // 替换配置项
        configItems.forEach(item => {
            const placeholder = `{${item.key}}`;
            let value = item.value;
            
            // 特殊处理平台名称
            if (item.key === 'platformName') {
                value = platform.charAt(0).toUpperCase() + platform.slice(1);
            }
            
            // 使用额外数据覆盖配置项值
            if (extraData[item.key] !== undefined) {
                value = extraData[item.key];
            }
            
            result = result.replace(new RegExp(placeholder, 'g'), value);
        });
        
        // 替换分隔符
        result = result.replace(/{separator}/g, separator);
        
        return result;
    }

    /**
     * 导出命名规则配置
     */
    static async exportConfig(): Promise<string> {
        const rules = await NamingRuleManager.getAllRules();
        const currentRule = await NamingRuleManager.getCurrentRule();
        
        const exportData = {
            version: '1.0.0',
            exportTime: new Date().toISOString(),
            currentRule: currentRule.name,
            rules: rules
        };
        
        return JSON.stringify(exportData, null, 2);
    }

    /**
     * 导入命名规则配置
     */
    static async importConfig(configJson: string): Promise<void> {
        try {
            const importData = JSON.parse(configJson);
            
            if (!importData.rules || !Array.isArray(importData.rules)) {
                throw new Error('无效的配置文件格式');
            }
            
            // 验证规则格式
            for (const rule of importData.rules) {
                if (!rule.name || !rule.normalTemplate || !rule.tceTemplate || !Array.isArray(rule.configItems)) {
                    throw new Error(`无效的命名规则格式: ${rule.name || '未知规则'}`);
                }
            }
            
            await NamingRuleManager.saveAllRules(importData.rules);
            
            // 如果有指定当前规则，则设置为当前规则
            if (importData.currentRule) {
                const rule = importData.rules.find((r: NamingRuleConfig) => r.name === importData.currentRule);
                if (rule) {
                    await NamingRuleManager.setCurrentRule(importData.currentRule);
                }
            }
            
        } catch (error) {
            console.error('导入配置失败:', error);
            throw new Error(`导入配置失败: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * 重置为默认规则列表
     */
    static async resetToDefaultRules(): Promise<void> {
        try {
            const defaultRules = await NamingRuleManager.loadDefaultRulesFromConfig();
            await NamingRuleManager.saveAllRules(defaultRules);
            
            // 设置第一个规则为当前规则
            if (defaultRules.length > 0) {
                await NamingRuleManager.setCurrentRule(defaultRules[0].name);
            }
            
        } catch (error) {
            console.error('重置为默认规则失败:', error);
            throw new Error(`重置为默认规则失败: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * 获取默认规则列表（不保存到配置中）
     */
    static async getDefaultRules(): Promise<NamingRuleConfig[]> {
        return await NamingRuleManager.loadDefaultRulesFromConfig();
    }
}