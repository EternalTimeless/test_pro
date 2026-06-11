import { readFileSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import { name } from '../../package.json' with { type: 'json' };

interface StoreUrlsPayload {
    googlePlayUrl: string;
    appStoreUrl: string;
}

const BROWSER_SRC_SUFFIX = join('src', 'browser');

function getExtensionRoot(): string {
    if (
        __dirname.endsWith(BROWSER_SRC_SUFFIX) ||
        __dirname.endsWith(BROWSER_SRC_SUFFIX.replace(/\\/g, '/'))
    ) {
        return resolve(__dirname, '../..');
    }
    return resolve(__dirname, '..');
}

const EXTENSION_ROOT = getExtensionRoot();
const SUPER_PACKAGE_PATH = join(EXTENSION_ROOT, 'package_assets', 'Common', 'SuperPackage.ts');
const PBASDK_PATH = join(EXTENSION_ROOT, 'package_assets', 'JiangYv', 'PBASDK-v3', 'PBASDK.ts');

const SUPER_GOOGLE_REGEX = /(private\s+_google_play_url\s*:\s*string\s*=\s*)(['"])(.*?)\2/;
const SUPER_APPLE_REGEX = /(private\s+_appstore_url\s*:\s*string\s*=\s*)(['"])(.*?)\2/;
const PBASDK_GOOGLE_REGEX = /(const\s+google_play\s*=\s*)(['"])(.*?)\2/;
const PBASDK_APPLE_REGEX = /(const\s+appstore\s*=\s*)(['"])(.*?)\2/;

const normalizeInput = (value?: string) => (value ?? '').trim();

const unescapeLiteral = (value: string) =>
    value
        .replace(/\\\\/g, '\\')
        .replace(/\\"/g, '"')
        .replace(/\\'/g, "'");

const escapeLiteral = (value: string, quote: string) => {
    let escaped = value.replace(/\\/g, '\\\\');
    if (quote === '"') {
        escaped = escaped.replace(/"/g, '\\"');
    } else if (quote === "'") {
        escaped = escaped.replace(/'/g, "\\'");
    }
    return escaped;
};

const extractLiteral = (content: string, regex: RegExp) => {
    const match = content.match(regex);
    if (!match) {
        return '';
    }
    return unescapeLiteral(match[3] ?? '');
};

const replaceLiteral = (content: string, regex: RegExp, nextValue: string, fieldName: string) => {
    let matched = false;
    const result = content.replace(regex, (_match, prefix, quote) => {
        matched = true;
        const sanitized = escapeLiteral(nextValue, quote);
        return `${prefix}${quote}${sanitized}${quote}`;
    });

    if (!matched) {
        throw new Error(`${fieldName} 字段未在文件中找到`);
    }

    return result;
};

const readStoreUrls = (): StoreUrlsPayload => {
    const superContent = readFileSync(SUPER_PACKAGE_PATH, 'utf-8');
    return {
        googlePlayUrl: extractLiteral(superContent, SUPER_GOOGLE_REGEX),
        appStoreUrl: extractLiteral(superContent, SUPER_APPLE_REGEX),
    };
};

const persistStoreUrls = (payload: StoreUrlsPayload) => {
    const superContent = readFileSync(SUPER_PACKAGE_PATH, 'utf-8');
    const updatedSuper = replaceLiteral(
        replaceLiteral(
            superContent,
            SUPER_GOOGLE_REGEX,
            payload.googlePlayUrl,
            'SuperPackage 谷歌商店地址',
        ),
        SUPER_APPLE_REGEX,
        payload.appStoreUrl,
        'SuperPackage 苹果商店地址',
    );
    writeFileSync(SUPER_PACKAGE_PATH, updatedSuper, 'utf-8');

    const pbContent = readFileSync(PBASDK_PATH, 'utf-8');
    const updatedPb = replaceLiteral(
        replaceLiteral(pbContent, PBASDK_GOOGLE_REGEX, payload.googlePlayUrl, 'PBASDK 谷歌商店地址'),
        PBASDK_APPLE_REGEX,
        payload.appStoreUrl,
        'PBASDK 苹果商店地址',
    );
    writeFileSync(PBASDK_PATH, updatedPb, 'utf-8');
};

export const methods = {
    async open() {
        Editor.Panel.open(name);
    },
    /**
     * @en A method that can be triggered by message
     * @zh 通过 message 触发的方法
     */
    openPanel() {
        Editor.Panel.open(name);
    },
    getVersion() {
        return Editor.App.version;
    },
    async getStoreUrls() {
        return readStoreUrls();
    },
    async setStoreUrls(payload: Partial<StoreUrlsPayload>) {
        const normalized: StoreUrlsPayload = {
            googlePlayUrl: normalizeInput(payload.googlePlayUrl),
            appStoreUrl: normalizeInput(payload.appStoreUrl),
        };
        persistStoreUrls(normalized);
        return normalized;
    },
};

export async function load() {
    console.log(`load ${name}`);
}

export function unload() {
    console.log(`unload ${name}`);
}
