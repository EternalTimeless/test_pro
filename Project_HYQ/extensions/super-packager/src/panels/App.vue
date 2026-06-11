<script setup lang="ts">
import { ref, reactive, onMounted, inject, toRaw, watch, computed } from 'vue'
import { ElMessageBox } from 'element-plus'
import { packer, PlatformEnum, PackConfig } from '../core/packer'
import { Box, Download, Setting, Link } from '@element-plus/icons-vue'
import { keyMessage } from './provide-inject'
import NamingRuleConfig from './components/NamingRuleConfig.vue'
import { NamingRuleManager } from '../utils/utils'

const EXTENSION_NAME = 'super-packager'

// 注入消息方法
const message = inject(keyMessage)!

// 动态表单数据
const formData = reactive<Record<string, any>>({
  packageDir: 'project://build/super-html',
  selectedPlatforms: [] as PlatformEnum[]
})

// 当前命名规则的配置项
const currentConfigItems = ref<any[]>([])

// 过滤掉 platformName 字段的配置项（平台名称由选择的平台自动生成）
const filteredConfigItems = computed(() => {
  return currentConfigItems.value.filter(item => item.key !== 'platformName')
})

// 将配置项分组为每行2列
const configItemChunks = computed(() => {
  const items = filteredConfigItems.value
  const chunks = []
  for (let i = 0; i < items.length; i += 2) {
    chunks.push(items.slice(i, i + 2))
  }
  return chunks
})

// 平台选项
const platformOptions = [
  { label: 'AppLovin', value: PlatformEnum.APPLOVIN },
  { label: 'Bigo', value: PlatformEnum.BIGO },
  { label: 'Common', value: PlatformEnum.COMMON },
  { label: 'Common Min', value: PlatformEnum.COMMON_MIN },
  { label: 'Facebook', value: PlatformEnum.FACEBOOK },
  { label: 'Google', value: PlatformEnum.GOOGLE },
  { label: 'IronSource', value: PlatformEnum.IRONSOURCE },
  { label: 'IronSource 2025', value: PlatformEnum.IRONSOURCE2025 },
  { label: 'Kwai', value: PlatformEnum.KWAI },
  { label: 'Liftoff', value: PlatformEnum.LIFTOFF },
  { label: 'Mintegral', value: PlatformEnum.MINTEGRAL },
  { label: 'Moloco', value: PlatformEnum.MOLOCO },
  { label: 'Nefta', value: PlatformEnum.NEFTA },
  { label: 'Pangle', value: PlatformEnum.PANGLE },
  { label: 'TikTok', value: PlatformEnum.TIKTOK },
  { label: 'Unity', value: PlatformEnum.UNITY },
  { label: 'Vungle', value: PlatformEnum.VUNGLE },
  { label: 'Snapchat', value: PlatformEnum.SNAPCHAT }
]

// 加载中状态
const loading = ref(false)

// 命名规则配置对话框状态
const showNamingConfig = ref(false)

// 当前命名规则预览
const currentNamingRule = ref('')

// 预览命名结果
const previewResult = ref('')

// 保存配置
const saveConfig = async () => {
  try {
    // 使用 toRaw 获取原始对象，避免序列化 reactive 代理对象
    const rawConfig = toRaw(formData)
    await Editor.Profile.setConfig('super-packager', 'config', rawConfig)
    
    // 同时保存到当前命名规则的 configItems 中
    await saveFormToRuleConfig()
    
    console.log('配置已保存')
  } catch (error) {
    console.error('保存配置失败:', error)
  }
}

// 加载配置
const loadConfig = async () => {
  try {
    const config = await Editor.Profile.getConfig('super-packager', 'config')
    if (config) {
      Object.assign(formData, config)
      console.log('配置已加载')
    }
  } catch (error) {
    console.error('加载配置失败:', error)
  }
}

// 处理打包
const handlePackage = async () => {
  // 动态验证表单 - 检查当前命名规则的必填字段（排除 platformName，因为它由平台选择自动生成）
  const missingFields = filteredConfigItems.value
    .filter((item: any) => item.required && !formData[item.key])
    .map((item: any) => item.label)
  
  if (missingFields.length > 0) {
    message({ message: `请填写所有必填字段: ${missingFields.join(', ')}`, type: 'error' })
    return
  }

  if (formData.selectedPlatforms.length === 0) {
    message({ message: '请至少选择一个平台', type: 'error' })
    return
  }

  loading.value = true

  try {
    console.log('开始打包...')
    // 动态打印当前配置项的值
    currentConfigItems.value.forEach(item => {
      console.log(`${item.label}:`, formData[item.key])
    })
    console.log('打包目录:', formData.packageDir)
    console.log('选择的平台:', formData.selectedPlatforms)

    // 保存配置
    await saveConfig()

    // 执行打包 - 构建兼容旧接口的配置对象，同时传递所有配置项
    const packConfig: PackConfig = {
      gameAbbr: formData.gameAbbr || '',
      packageDate: formData.packageDate || '',
      adName: formData.adName || '',
      plannerAbbr: formData.plannerAbbr || '',
      companyPrefix: formData.companyPrefix || 'RBN',
      packageDir: formData.packageDir,
      selectedPlatforms: formData.selectedPlatforms,
      configValues: formData  // 传递所有表单数据，包括 language 等动态配置项
    }

    const resultPath = await packer.pack(packConfig)

    message({ message: '打包完成！', type: 'success' })

    // 打开打包好的文件夹
    if (resultPath) {
      const { shell } = require('electron')
      shell.showItemInFolder(resultPath)
      console.log('已打开文件夹:', resultPath)
    }
  } catch (error) {
    console.error('打包失败:', error)
    message({ message: `打包失败: ${error instanceof Error ? error.message : String(error)}`, type: 'error' })
  } finally {
    loading.value = false
  }
}

// 格式化日期为 YYYYMMDD 格式
const formatDate = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  formData.packageDate = `${year}${month}${day}`
}

// 选择打包目录
const selectPackageDir = async () => {
  try {
    const result = await Editor.Dialog.select({
      title: '选择打包目录',
      type: 'directory',
      path: formData.packageDir.startsWith('project://') 
        ? Editor.Project.path + '/' + formData.packageDir.replace('project://', '')
        : formData.packageDir
    })
    
    if (result.canceled || !result.filePaths || result.filePaths.length === 0) {
      return
    }
    
    const selectedPath = result.filePaths[0]
    // 如果选择的路径在项目目录内，转换为 project:// 格式
    if (selectedPath.startsWith(Editor.Project.path)) {
      const relativePath = selectedPath.replace(Editor.Project.path, '').replace(/^[\/\\]/, '')
      formData.packageDir = `project://${relativePath.replace(/\\/g, '/')}`
    } else {
      formData.packageDir = selectedPath.replace(/\\/g, '/')
    }
    
    console.log('选择的打包目录:', formData.packageDir)
    message({ message: '目录选择成功', type: 'success' })
  } catch (error) {
    console.error('选择目录失败:', error)
    message({ message: '选择目录失败', type: 'error' })
  }
}

// 加载当前命名规则信息
const loadCurrentNamingRule = async () => {
  try {
    const rule = await NamingRuleManager.getCurrentRule()
    currentNamingRule.value = rule.name
    currentConfigItems.value = rule.configItems || []
    console.log('当前命名规则配置项:', currentConfigItems.value)
  } catch (error) {
    console.error('加载当前命名规则失败:', error)
  }
}

// 更新预览命名结果
const updatePreview = async () => {
  // 检查用户需要输入的必填字段是否都有值（排除 platformName，因为它由平台选择自动生成）
  const requiredFields = filteredConfigItems.value.filter((item: any) => item.required)
  const hasAllRequiredFields = requiredFields.every((item: any) => formData[item.key])
  
  if (!hasAllRequiredFields) {
    previewResult.value = ''
    return
  }
  
  try {
    const currentRule = await NamingRuleManager.getCurrentRule()
    
    // 使用当前表单数据生成预览
    const previewData = { ...formData }
    previewData.platformName = '平台'
    
    previewResult.value = NamingRuleManager.generateFileName(
      currentRule.normalTemplate,
      currentRule.configItems,
      currentRule.separator,
      '平台',
      previewData
    )
  } catch (error) {
    console.error('生成预览失败:', error)
    // 生成简单的预览格式 - 只包含用户输入的字段和平台占位符
    const userDataStr = filteredConfigItems.value
      .map((item: any) => formData[item.key] || `[${item.label}]`)
      .join('_')
    previewResult.value = `${userDataStr}_[平台]_ALL`
  }
}

// 获取字段的最大长度
const getMaxLength = (key: string) => {
  switch (key) {
    case 'packageDate':
      return 8
    case 'gameAbbr':
    case 'plannerAbbr':
    case 'companyPrefix':
      return 10
    case 'serialNumber':
      return 15
    case 'language':
      return 5
    default:
      return 20
  }
}

// 从当前命名规则加载配置值到表单
const loadRuleConfigToForm = async () => {
  try {
    const currentRule = await NamingRuleManager.getCurrentRule()
    
    // 从命名规则的 configItems 中加载预设值到表单（包括 platformName，虽然它不会显示在界面上）
    currentRule.configItems.forEach((item: any) => {
      if (item.value) {
        formData[item.key] = item.value
      }
    })
    
    // 更新预览
    await updatePreview()
  } catch (error) {
    console.error('加载规则配置到表单失败:', error)
  }
}

// 将表单值保存到当前命名规则的 configItems 中
const saveFormToRuleConfig = async () => {
  try {
    const currentRule = await NamingRuleManager.getCurrentRule()
    
    // 更新规则中的配置项值（platformName 不在表单中，将保持其原有值）
    currentRule.configItems.forEach((item: any) => {
      if (formData[item.key] !== undefined) {
        item.value = formData[item.key]
      }
    })
    
    // 更新规则
    await NamingRuleManager.addRule(currentRule)
  } catch (error) {
    console.error('保存表单到规则配置失败:', error)
  }
}

// 处理命名规则配置变化
const handleNamingConfigChange = async (value: boolean) => {
  showNamingConfig.value = value
  // 当配置对话框关闭时，重新加载当前命名规则并同步配置
  if (!value) {
    await loadCurrentNamingRule()
    await loadRuleConfigToForm() // 加载规则预设值到表单（包含更新预览）
  }
}

// 监听表单数据变化，实时更新预览
watch(formData, () => {
  updatePreview()
}, { 
  deep: true,
  // 设置延迟以避免频繁更新
  flush: 'post'
})

// 监听当前配置项变化，更新表单监听
watch(currentConfigItems, () => {
  updatePreview()
}, { 
  deep: true 
})

// 组件挂载时加载配置
onMounted(async () => {
  await loadConfig()
  await loadCurrentNamingRule()

  // 检查是否有已保存的配置，使用动态字段检查（排除 packageDate 和 platformName）
  const hasExistingConfig = filteredConfigItems.value.some((item: any) =>
    item.key !== 'packageDate' && formData[item.key]
  )

  if (!hasExistingConfig) {
    await loadRuleConfigToForm()
  } else {
    // 如果有现有配置，只更新预览
    await updatePreview()
  }

  // 如果日期字段为空，自动填入今天日期
  const dateField = currentConfigItems.value.find(item => item.key === 'packageDate')
  if (dateField && !formData.packageDate) {
    formatDate()
    await updatePreview() // 日期更新后更新预览
  }
})
</script>

<template>
  <div class="container">
    <div class="header">
      <!-- 文档链接区域 -->
      <div class="doc-link-section">
        <span class="doc-tip">⚠️ 打包前必看：</span>
        <el-link
          href="https://w1cvodmt1g.feishu.cn/wiki/Ut5wwHE6viFRY4kVCiEcgDLNndd"
          :icon="Link"
          type="primary"
          target="_blank"
          style="font-size: 14px;"
        >
          项目正式打包需求文档
        </el-link>
        <span class="doc-note">（与插件不符情况下以文档为准）</span>
      </div>

      <!-- 标题区域 -->
      <div class="title-section">
        <h1>
          <el-icon><Box /></el-icon>
          究极无敌打包工具
        </h1>
        <p>为多个广告平台打包试玩广告，支持生成常规版和强制跳转版(TCE)</p>
      </div>
      
      <!-- 按钮区域 -->
      <div class="header-actions">
        <el-button 
          type="primary" 
          :icon="Setting" 
          @click="showNamingConfig = true"
          size="default"
        >
          命名规则配置
        </el-button>
      </div>
      
      <!-- 当前命名规则显示 -->
      <div class="current-rule-info" v-if="currentNamingRule">
        <el-tag type="info" size="small">
          当前命名规则: {{ currentNamingRule }}
        </el-tag>
        <el-tag v-if="previewResult" type="success" size="small" style="margin-left: 10px;">
          预览: {{ previewResult }}
        </el-tag>
      </div>
    </div>

    <el-card class="form-card">
      <template #header>
        <div class="card-header">
          <span>打包配置</span>
        </div>
      </template>

      <el-form :model="formData" label-width="120px" size="default">
        <!-- 动态生成配置字段 -->
        <template v-if="configItemChunks.length > 0">
          <el-row v-for="(chunk, chunkIndex) in configItemChunks" :key="`chunk-${chunkIndex}`" :gutter="20">
            <el-col v-for="item in chunk" :key="item.key" :span="12">
              <el-form-item
                :label="item.label"
                :required="item.required"
              >
                <el-input
                  v-model="formData[item.key]"
                  :placeholder="item.description"
                  :maxlength="getMaxLength(item.key)"
                  show-word-limit
                >
                  <!-- 特殊处理日期字段，添加今天按钮 -->
                  <template v-if="item.key === 'packageDate'" #append>
                    <el-button @click="formatDate">今天</el-button>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
        
        <!-- 加载提示 -->
        <template v-else-if="currentConfigItems.length === 0">
          <el-row :gutter="20">
            <el-col :span="24">
              <div style="text-align: center; padding: 20px; color: #909399;">
                正在加载命名规则配置...
              </div>
            </el-col>
          </el-row>
        </template>

        <!-- 打包目录字段（固定不变） -->
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="打包目录">
              <el-input
                v-model="formData.packageDir"
                placeholder="project://build/super-html"
              >
                <template #append>
                  <el-button @click="selectPackageDir">选择</el-button>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="选择平台" required>
          <el-checkbox-group v-model="formData.selectedPlatforms" class="platform-checkboxes">
            <div class="platform-row" v-for="(chunk, index) in Math.ceil(platformOptions.length / 6)" :key="index">
              <el-checkbox 
                v-for="option in platformOptions.slice(index * 6, (index + 1) * 6)" 
                :key="option.value"
                :label="option.value"
                class="platform-checkbox"
              >
                {{ option.label }}
              </el-checkbox>
            </div>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item>
          <el-button 
            type="primary" 
            size="large"
            :loading="loading"
            @click="handlePackage"
            style="width: 200px;"
          >
            <el-icon v-if="!loading"><Download /></el-icon>
            {{ loading ? '正在打包...' : '开始打包' }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 命名规则配置对话框 -->
    <NamingRuleConfig 
      v-model="showNamingConfig" 
      @update:modelValue="handleNamingConfigChange"
    />
  </div>
</template>

<style scoped>
.container {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
  position: relative;
}

.header {
  margin-bottom: 30px;
}

.doc-link-section {
  text-align: center;
  margin-bottom: 20px;
  padding: 12px 16px;
  background-color: #2d2d2d;
  border: 1px solid #606266;
  border-left: 4px solid #e6a23c;
  border-radius: 4px;
}

.doc-tip {
  color: #e6a23c;
  font-weight: 600;
  font-size: 14px;
  margin-right: 8px;
}

.doc-note {
  color: #909399;
  font-size: 12px;
  margin-left: 8px;
}

.title-section {
  text-align: center;
  margin-bottom: 20px;
}

.header h1 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 28px;
  color: #409eff;
  margin-bottom: 10px;
}

.header p {
  color: #666;
  font-size: 14px;
}

.header-actions {
  text-align: center;
  margin-bottom: 15px;
}

.current-rule-info {
  text-align: center;
  padding: 10px;
  background-color: #2d2d2d;
  border-radius: 6px;
  border: 1px solid #404040;
}

.form-card {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  margin-bottom: 20px;
  background-color: #1e1e1e;
  border: 1px solid #404040;
}

.card-header {
  font-weight: bold;
  font-size: 16px;
}

.platform-checkboxes {
  width: 100%;
}

.platform-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
}

.platform-checkbox {
  flex: 0 0 auto;
  min-width: 120px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #e6e6e6;
}

:deep(.el-card__body) {
  background-color: #1e1e1e;
  color: #ffffff;
}

:deep(.el-card__header) {
  background-color: #2d2d2d;
  border-bottom: 1px solid #404040;
  color: #ffffff;
}

:deep(.el-button--primary) {
  background: linear-gradient(135deg, #409eff 0%, #5dade2 100%);
  border: none;
}

:deep(.el-button--primary:hover) {
  background: linear-gradient(135deg, #66b1ff 0%, #85c5ea 100%);
}

/* 深色主题下的复选框样式 */
:deep(.el-checkbox__label) {
  color: #e6e6e6;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #409eff;
  border-color: #409eff;
}

:deep(.el-checkbox__inner) {
  background-color: #2d2d2d;
  border-color: #606266;
}

:deep(.el-checkbox__inner:hover) {
  border-color: #409eff;
}

/* 深色主题下的输入框样式 */
:deep(.el-input__wrapper) {
  background-color: #2d2d2d;
  border: 1px solid #606266;
}

:deep(.el-input__wrapper:hover) {
  border-color: #409eff;
}

:deep(.el-input__wrapper.is-focus) {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

:deep(.el-input__inner) {
  background-color: transparent;
  color: #ffffff;
}

:deep(.el-input__inner::placeholder) {
  color: #909399;
}

:deep(.el-input-group__append) {
  background-color: #404040;
  border-color: #606266;
  color: #ffffff;
}

/* 深色主题下的字数统计 */
:deep(.el-input__count) {
  background-color: #2d2d2d;
  color: #909399;
}

/* 深色主题下的按钮样式调整 */
:deep(.el-input-group__append .el-button) {
  background-color: #404040;
  border-color: #606266;
  color: #ffffff;
}

:deep(.el-input-group__append .el-button:hover) {
  background-color: #409eff;
  border-color: #409eff;
  color: #ffffff;
}

/* 文档链接样式 */
:deep(.doc-link-section .el-link) {
  color: #409eff !important;
}

:deep(.doc-link-section .el-link:hover) {
  color: #66b1ff !important;
}

/* 确保面板根元素不影响滚动 */
:global(#app) {
  height: 100vh !important;
  max-height: 100vh !important;
  overflow: hidden !important;
  padding: 0 !important;
  margin: 0 !important;
}

/* 自定义滚动条样式 - 深色主题 */
.container::-webkit-scrollbar {
  width: 8px;
}

.container::-webkit-scrollbar-track {
  background: #1a1a1a;
  border-radius: 4px;
}

.container::-webkit-scrollbar-thumb {
  background: #404040;
  border-radius: 4px;
  border: 1px solid #2d2d2d;
}

.container::-webkit-scrollbar-thumb:hover {
  background: #505050;
}
</style>
