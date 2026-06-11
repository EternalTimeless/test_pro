import { BuildPlugin } from "@cocos/creator-types/editor/packages/builder/@types/protected";

export const configs: BuildPlugin.Configs = {
    'web-mobile': {
        hooks: './hook.cjs',
        options: {
            googlePlayUrl: {
                label: '谷歌商店链接',
                description: 'Google Play Store 链接地址',
                default: '',
                render: {
                    ui: 'ui-input',
                    attributes: {
                        placeholder: 'https://play.google.com/'
                    }
                }
            },
            appStoreUrl: {
                label: '苹果商店链接',
                description: 'Apple App Store 链接地址',
                default: '',
                render: {
                    ui: 'ui-input',
                    attributes: {
                        placeholder: 'https://apps.apple.com/'
                    }
                }
            }
        }
    }
};