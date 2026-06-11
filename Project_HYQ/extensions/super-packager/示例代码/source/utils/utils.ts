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
} 