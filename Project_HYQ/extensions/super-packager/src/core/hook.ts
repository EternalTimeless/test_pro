import { BuildHook } from "@cocos/creator-types/editor/packages/builder/@types/public";

const PACKAGE_NAME = '[SUPER_PACKAGE]';
const EXTENSION_NAME = 'super-packager';

interface StoreUrlsPayload {
    googlePlayUrl: string;
    appStoreUrl: string;
}

export const throwError: BuildHook.throwError = true;

export const load: BuildHook.load = async function() {
    console.log(PACKAGE_NAME, load);
};

export const onBeforeBuild: BuildHook.onBeforeBuild = async function(options) {
    console.log(PACKAGE_NAME, 'onBeforeBuild');

    try {
        // 从构建选项中读取商店链接配置
        const packageOptions = options.packages?.[EXTENSION_NAME];

        if (packageOptions !== undefined) {
            const googlePlayUrl = packageOptions.googlePlayUrl || '';
            const appStoreUrl = packageOptions.appStoreUrl || '';

            console.log(PACKAGE_NAME, '商店链接配置:', {
                googlePlayUrl,
                appStoreUrl
            });

            // 同步到文件（包括空字符串）
            const payload: StoreUrlsPayload = {
                googlePlayUrl: googlePlayUrl.trim(),
                appStoreUrl: appStoreUrl.trim()
            };

            // 调用 browser 进程的方法来同步链接
            await Editor.Message.request(EXTENSION_NAME, 'set-store-urls', payload);
            console.log(PACKAGE_NAME, '商店链接已同步到文件');
        }
    } catch (error) {
        console.error(PACKAGE_NAME, '同步商店链接失败:', error);
        // 不阻断构建流程，只打印错误
    }
};

export const onBeforeCompressSettings: BuildHook.onBeforeCompressSettings = async function(options, result) {
    // Todo some thing
    console.log(PACKAGE_NAME,'onBeforeCompressSettings');
};

export const onAfterCompressSettings: BuildHook.onAfterCompressSettings = async function(options, result) {
    // Todo some thing
    console.log(PACKAGE_NAME, 'onAfterCompressSettings');
};

export const onAfterBuild: BuildHook.onAfterBuild = async function(options, result) {
    console.log(PACKAGE_NAME, 'onAfterBuild');
};

export const unload: BuildHook.unload = async function() {
    console.log(PACKAGE_NAME, 'unload');
};