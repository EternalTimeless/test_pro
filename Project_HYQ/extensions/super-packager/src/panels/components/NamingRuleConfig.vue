<template>
  <el-dialog
    v-model="visible"
    title="命名规则配置"
    width="80%"
    :before-close="handleClose"
    class="naming-rule-dialog"
  >
    <div class="naming-config-container">
      <!-- 规则选择 -->
      <el-card class="rule-selector-card">
        <template #header>
          <div class="card-header">
            <span>选择命名规则</span>
            <div class="header-actions">
              <el-button size="small" @click="createNewRule">新建规则</el-button>
              <el-button size="small" @click="resetToDefaults">重置默认规则</el-button>
              <el-button size="small" @click="exportConfig">导出配置</el-button>
              <el-button size="small" @click="showImportDialog = true">导入配置</el-button>
            </div>
          </div>
        </template>
        
        <el-select
          v-model="currentRuleName"
          placeholder="选择命名规则"
          style="width: 100%"
          :appendTo="appRootDom"
          @change="handleRuleChange"
        >
          <el-option
            v-for="rule in allRules"
            :key="rule.name"
            :label="rule.name"
            :value="rule.name"
          />
        </el-select>
      </el-card>

      <!-- 当前规则详情 -->
      <el-card v-if="currentRule" class="rule-detail-card">
        <template #header>
          <div class="card-header">
            <span>{{ currentRule.name }} - 详细配置</span>
            <div class="header-actions">
              <el-button size="small" @click="editCurrentRule">编辑</el-button>
              <el-button 
                size="small" 
                type="danger" 
                @click="deleteCurrentRule"
                :disabled="allRules.length <= 1"
              >
                删除
              </el-button>
            </div>
          </div>
        </template>

        <div class="rule-preview">
          <div class="template-preview">
            <h4>命名模板预览</h4>
            <div class="template-item">
              <label>普通版本：</label>
              <code>{{ previewFileName(currentRule.normalTemplate) }}</code>
            </div>
            <div class="template-item">
              <label>TCE版本：</label>
              <code>{{ previewFileName(currentRule.tceTemplate) }}</code>
            </div>
          </div>

          <div class="config-items-preview">
            <h4>配置项</h4>
            <el-table :data="currentRule.configItems" size="small">
              <el-table-column prop="key" label="键名" width="120" />
              <el-table-column prop="label" label="显示名称" width="150" />
              <el-table-column prop="value" label="默认值" width="120" />
              <el-table-column prop="description" label="描述" min-width="150" />
              <el-table-column prop="required" label="必填" width="80">
                <template #default="{ row }">
                  <el-tag :type="row.required ? 'danger' : 'info'" size="small">
                    {{ row.required ? '是' : '否' }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 创建/编辑规则对话框 -->
    <el-dialog
      v-model="showCreateDialog"  
      :title="editingRule ? '编辑命名规则' : '创建命名规则'"
      width="75%"
      :z-index="3000"
      class="nested-dialog"
    >
      <el-form :model="ruleForm" label-width="100px" size="default">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="规则名称" required>
              <el-input v-model="ruleForm.name" placeholder="输入规则名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分隔符">
              <el-input v-model="ruleForm.separator" placeholder="默认: _" maxlength="1" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="普通版模板" required>
          <el-input
            ref="normalTemplateRef"
            v-model="ruleForm.normalTemplate"
            type="textarea"
            :rows="2"
            placeholder="例如: {gameAbbr}{separator}{packageDate}{separator}{adName}{separator}..."
          />
          <div class="template-help">
            <div class="placeholder-tags">
              <span class="help-label">点击插入占位符：</span>
              <el-tag 
                v-for="ph in availablePlaceholders" 
                :key="ph.value" 
                size="small" 
                class="placeholder-tag"
                effect="plain"
                @click="insertPlaceholder(ph.value, 'normal')"
              >
                {{ ph.label }}
              </el-tag>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="TCE版模板" required>
          <el-input
            ref="tceTemplateRef"
            v-model="ruleForm.tceTemplate"
            type="textarea"
            :rows="2"
            placeholder="例如: {gameAbbr}{separator}{packageDate}{separator}{adName}TCE{separator}..."
          />
          <div class="template-help">
            <div class="placeholder-tags">
              <span class="help-label">点击插入占位符：</span>
              <el-tag 
                v-for="ph in availablePlaceholders" 
                :key="ph.value" 
                size="small" 
                class="placeholder-tag"
                effect="plain"
                @click="insertPlaceholder(ph.value, 'tce')"
              >
                {{ ph.label }}
              </el-tag>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="配置项">
          <div class="config-items-editor">
            <div class="config-items-header">
              <span class="config-header-item col-key">键名</span>
              <span class="config-header-item col-label">显示名称</span>
              <span class="config-header-item col-value">默认值</span>
              <span class="config-header-item col-desc">描述</span>
              <span class="config-header-item col-req">必填</span>
              <span class="config-header-item col-op">操作</span>
            </div>
            <div v-for="(item, index) in ruleForm.configItems" :key="index" class="config-item-row">
              <div class="col-key">
                <el-input
                  v-model="item.key"
                  placeholder="键名"
                  size="small"
                  :class="{ 'error-border': !item.key }"
                />
              </div>
              <div class="col-label">
                <el-input
                  v-model="item.label"
                  placeholder="显示名称"
                  size="small"
                  :class="{ 'error-border': !item.label }"
                />
              </div>
              <div class="col-value">
                <el-input
                  v-model="item.value"
                  placeholder="默认值"
                  size="small"
                />
              </div>
              <div class="col-desc">
                <el-input
                  v-model="item.description"
                  placeholder="描述信息"
                  size="small"
                />
              </div>
              <div class="col-req">
                <el-switch
                  v-model="item.required"
                  size="small"
                  inline-prompt
                  active-text="是"
                  inactive-text="否"
                />
              </div>
              <div class="col-op">
                <el-button
                  type="danger"
                  link
                  size="small"
                  @click="removeConfigItem(index)"
                >
                  <i class="iconfont icon-delete"></i> 删除
                </el-button>
              </div>
            </div>
            <div class="config-actions">
              <el-button @click="addConfigItem" type="primary" plain size="small" style="width: 100%">
                + 添加配置项
              </el-button>
            </div>
          </div>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showCreateDialog = false">取消</el-button>
        <el-button type="primary" @click="saveRule">保存</el-button>
      </template>
    </el-dialog>

    <!-- 导入配置对话框 -->
    <el-dialog
      v-model="showImportDialog"
      title="导入配置"
      width="50%"
      :z-index="3000"
      class="nested-dialog"
    >
      <div class="import-config-container">
        <div class="import-actions">
          <el-button @click="selectConfigFile" size="small">选择配置文件</el-button>
          <span class="import-tip">或直接粘贴 JSON 内容到下方文本框</span>
        </div>
        <el-input
          v-model="importConfigText"
          type="textarea"
          :rows="10"
          placeholder="粘贴配置JSON内容..."
        />
      </div>
      <template #footer>
        <el-button @click="showImportDialog = false">取消</el-button>
        <el-button type="primary" @click="importConfig">导入</el-button>
      </template>
    </el-dialog>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, inject, nextTick } from 'vue'
import { NamingRuleManager, NamingRuleConfig, NamingConfigItem, DEFAULT_NAMING_CONFIG } from '../../utils/utils'
import { keyMessage, keyAppRoot } from '../provide-inject'
import { ElMessageBox } from 'element-plus'

// 注入消息方法和根元素
const message = inject(keyMessage)!
const appRootDom = inject(keyAppRoot)!

// Props
const props = defineProps<{
  modelValue: boolean
}>()

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

// 响应式数据
const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const allRules = ref<NamingRuleConfig[]>([])
const currentRuleName = ref('')
const currentRule = computed(() => allRules.value.find(r => r.name === currentRuleName.value))

const showCreateDialog = ref(false)
const showImportDialog = ref(false)
const editingRule = ref(false)
const importConfigText = ref('')

// Template refs
const normalTemplateRef = ref()
const tceTemplateRef = ref()

// 表单数据
const ruleForm = reactive<NamingRuleConfig>({
  name: '',
  normalTemplate: '',
  tceTemplate: '',
  separator: '_',
  configItems: []
})

// 可用占位符
const availablePlaceholders = computed(() => {
  const items = ruleForm.configItems
    .filter(item => item.key && item.key.trim())
    .map(item => ({
      label: item.label || item.key,
      value: `{${item.key}}`
    }))
  return [{ label: '分隔符', value: '{separator}' }, ...items]
})

// 插入占位符
const insertPlaceholder = (placeholder: string, type: 'normal' | 'tce') => {
  const inputRef = type === 'normal' ? normalTemplateRef.value : tceTemplateRef.value
  if (!inputRef) return

  // 获取 textarea 元素
  const textarea = inputRef.$el.querySelector('textarea')
  if (!textarea) return

  const startPos = textarea.selectionStart
  const endPos = textarea.selectionEnd
  const value = type === 'normal' ? ruleForm.normalTemplate : ruleForm.tceTemplate

  const newValue = value.substring(0, startPos) + placeholder + value.substring(endPos)
  
  if (type === 'normal') {
    ruleForm.normalTemplate = newValue
  } else {
    ruleForm.tceTemplate = newValue
  }

  // 恢复焦点并移动光标
  nextTick(() => {
    textarea.focus()
    const newPos = startPos + placeholder.length
    textarea.setSelectionRange(newPos, newPos)
  })
}

// 加载所有规则
const loadRules = async () => {
  try {
    allRules.value = await NamingRuleManager.getAllRules()
    const current = await NamingRuleManager.getCurrentRule()
    currentRuleName.value = current.name
  } catch (error) {
    console.error('加载命名规则失败:', error)
    message({ message: '加载命名规则失败', type: 'error' })
  }
}

// 规则切换
const handleRuleChange = async (ruleName: string) => {
  try {
    await NamingRuleManager.setCurrentRule(ruleName)
    message({ message: '命名规则已切换', type: 'success' })
    // 通知父组件刷新
    emit('update:modelValue', true)
  } catch (error) {
    console.error('切换命名规则失败:', error)
    message({ message: '切换命名规则失败', type: 'error' })
  }
}

// 预览文件名
const previewFileName = (template: string) => {
  if (!currentRule.value) return template

  // 使用配置项的默认值，如果没有默认值则使用占位符
  const sampleData: Record<string, any> = {}
  currentRule.value.configItems.forEach((item: any) => {
    if (item.value) {
      // 如果有默认值，使用默认值
      sampleData[item.key] = item.value
    } else {
      // 如果没有默认值，使用占位符示例
      switch (item.key) {
        case 'gameAbbr':
          sampleData[item.key] = 'MF'
          break
        case 'packageDate':
          sampleData[item.key] = '20241201'
          break
        case 'adName':
          sampleData[item.key] = 'TestAd'
          break
        case 'plannerAbbr':
          sampleData[item.key] = 'ABC'
          break
        case 'companyPrefix':
          sampleData[item.key] = 'RBN'
          break
        case 'platformName':
          sampleData[item.key] = 'Facebook'
          break
        default:
          sampleData[item.key] = `[${item.label}]`
      }
    }
  })

  return NamingRuleManager.generateFileName(
    template,
    currentRule.value.configItems,
    currentRule.value.separator,
    'facebook',
    sampleData
  )
}

// 重置表单
const resetForm = () => {
  Object.assign(ruleForm, {
    name: '',
    normalTemplate: '{gameAbbr}{separator}{packageDate}{separator}{adName}{separator}{plannerAbbr}{separator}{companyPrefix}{separator}{platformName}{separator}ALL',
    tceTemplate: '{gameAbbr}{separator}{packageDate}{separator}{adName}TCE{separator}{plannerAbbr}{separator}{companyPrefix}{separator}{platformName}{separator}ALL',
    separator: '_',
    configItems: [
      { key: 'gameAbbr', label: '游戏名称缩写', value: '', required: true, description: '例如: MF, TH, LW' },
      { key: 'packageDate', label: '打包日期', value: '', required: true, description: 'YYYYMMDD格式' },
      { key: 'adName', label: '试玩广告名称', value: '', required: true, description: '试玩广告的名称' },
      { key: 'plannerAbbr', label: '策划名字缩写', value: '', required: true, description: '甲方策划名字缩写' },
      { key: 'companyPrefix', label: '公司前缀', value: 'RBN', required: false, description: '公司前缀标识' },
      { key: 'platformName', label: '平台名称', value: '', required: true, description: '自动根据选择的平台生成' }
    ]
  })
}

// 创建新规则
const createNewRule = () => {
  editingRule.value = false
  resetForm()
  showCreateDialog.value = true
}

// 编辑当前规则
const editCurrentRule = () => {
  if (!currentRule.value) return
  
  editingRule.value = true
  Object.assign(ruleForm, JSON.parse(JSON.stringify(currentRule.value)))
  showCreateDialog.value = true
}

// 删除当前规则
const deleteCurrentRule = async () => {
  if (!currentRule.value || allRules.value.length <= 1) return
  
  try {
    await ElMessageBox.confirm(
      `确定要删除命名规则 "${currentRule.value.name}" 吗？`,
      '确认删除',
      { 
        type: 'warning',
        appendTo: appRootDom
      }
    )
    
    await NamingRuleManager.deleteRule(currentRule.value.name)
    await loadRules()
    message({ message: '命名规则已删除', type: 'success' })
    
    // 通知父组件刷新
    emit('update:modelValue', true)
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除命名规则失败:', error)
      message({ message: '删除命名规则失败', type: 'error' })
    }
  }
}

// 添加配置项
const addConfigItem = () => {
  ruleForm.configItems.push({
    key: '',
    label: '',
    value: '',
    required: false,
    description: ''
  })
}

// 删除配置项
const removeConfigItem = (index: number) => {
  ruleForm.configItems.splice(index, 1)
}

// 保存规则
const saveRule = async () => {
  // 验证表单
  if (!ruleForm.name.trim()) {
    message({ message: '请输入规则名称', type: 'error' })
    return
  }
  
  if (!ruleForm.normalTemplate.trim() || !ruleForm.tceTemplate.trim()) {
    message({ message: '请输入命名模板', type: 'error' })
    return
  }
  
  if (ruleForm.configItems.length === 0) {
    message({ message: '至少需要一个配置项', type: 'error' })
    return
  }
  
  // 检查配置项是否完整
  for (const item of ruleForm.configItems) {
    if (!item.key.trim() || !item.label.trim()) {
      message({ message: '配置项的键名和显示名称不能为空', type: 'error' })
      return
    }
  }
  
  try {
    // 将响应式对象转换为纯对象，避免 IPC 序列化问题
    const plainRuleForm = JSON.parse(JSON.stringify(ruleForm))
    await NamingRuleManager.addRule(plainRuleForm)
    await loadRules()
    
    // 设置为当前规则
    currentRuleName.value = ruleForm.name
    await NamingRuleManager.setCurrentRule(ruleForm.name)
    
    showCreateDialog.value = false
    editingRule.value = false
    message({ message: '命名规则已保存', type: 'success' })
    
    // 通知父组件刷新
    emit('update:modelValue', true)
  } catch (error) {
    console.error('保存命名规则失败:', error)
    message({ message: '保存命名规则失败', type: 'error' })
  }
}

// 导出配置
const exportConfig = async () => {
  try {
    const configJson = await NamingRuleManager.exportConfig()
    
    // 创建下载链接
    const blob = new Blob([configJson], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `naming-rules-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    
    message({ message: '配置已导出', type: 'success' })
  } catch (error) {
    console.error('导出配置失败:', error)
    message({ message: '导出配置失败', type: 'error' })
  }
}

// 选择配置文件
const selectConfigFile = async () => {
  try {
    const result = await Editor.Dialog.select({
      title: '选择配置文件',
      type: 'file',
      filters: [{ name: 'JSON 文件', extensions: ['json'] }]
    })

    if (result.canceled || !result.filePaths || result.filePaths.length === 0) {
      return
    }

    const filePath = result.filePaths[0]
    const fs = require('fs')
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    importConfigText.value = fileContent

    message({ message: '文件已加载', type: 'success' })
  } catch (error) {
    console.error('选择文件失败:', error)
    message({ message: '选择文件失败', type: 'error' })
  }
}

// 导入配置
const importConfig = async () => {
  if (!importConfigText.value.trim()) {
    message({ message: '请输入配置内容', type: 'error' })
    return
  }

  try {
    await NamingRuleManager.importConfig(importConfigText.value)
    await loadRules()

    showImportDialog.value = false
    importConfigText.value = ''
    message({ message: '配置已导入', type: 'success' })

    // 通知父组件刷新
    emit('update:modelValue', true)
  } catch (error) {
    console.error('导入配置失败:', error)
    message({ message: `导入配置失败: ${error instanceof Error ? error.message : String(error)}`, type: 'error' })
  }
}

// 重置为默认规则
const resetToDefaults = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要重置为默认命名规则列表吗？这将覆盖所有当前保存的规则。',
      '确认重置',
      { 
        type: 'warning',
        appendTo: appRootDom
      }
    )
    
    await NamingRuleManager.resetToDefaultRules()
    await loadRules()
    message({ message: '已重置为默认规则列表', type: 'success' })
    
    // 通知父组件刷新
    emit('update:modelValue', true)
  } catch (error) {
    if (error !== 'cancel') {
      console.error('重置为默认规则失败:', error)
      message({ message: '重置为默认规则失败', type: 'error' })
    }
  }
}

// 关闭对话框
const handleClose = () => {
  visible.value = false
}

// 组件挂载时加载规则
onMounted(() => {
  loadRules()
  resetForm()
})
</script>

<style scoped>
.naming-config-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.rule-selector-card,
.rule-detail-card {
  background-color: #1e1e1e;
  border: 1px solid #404040;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.rule-preview {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.template-preview h4,
.config-items-preview h4 {
  margin: 0 0 10px 0;
  color: #e6e6e6;
}

.template-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.template-item label {
  font-weight: 500;
  min-width: 80px;
  color: #e6e6e6;
}

.template-item code {
  background-color: #2d2d2d;
  padding: 4px 8px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  color: #66b1ff;
}

.config-items-editor {
  display: flex;
  flex-direction: column;
  gap: 4px;
  border: 1px solid #404040;
  border-radius: 6px;
  padding: 12px;
  background-color: #2d2d2d;
  overflow-x: auto; /* Allow horizontal scrolling */
}

.config-items-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid #404040;
  margin-bottom: 8px;
  font-weight: 500;
  color: #e6e6e6;
  min-width: 680px; /* Prevent header from squashing */
}

.config-header-item {
  font-size: 12px;
  color: #909399;
  flex-shrink: 0; /* Prevent items from shrinking */
}

.config-item-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 0;
  min-width: 680px; /* Prevent row from squashing */
}

/* Column widths */
.col-key { width: 120px; flex-shrink: 0; }
.col-label { width: 140px; flex-shrink: 0; }
.col-value { width: 120px; flex-shrink: 0; }
.col-desc { flex: 1; min-width: 150px; }
.col-req { width: 60px; display: flex; justify-content: center; flex-shrink: 0; }
.col-op { width: 80px; display: flex; justify-content: center; flex-shrink: 0; }

.config-actions {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #404040;
}

.template-help {
  margin-top: 8px;
}

.placeholder-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.help-label {
  font-size: 12px;
  color: #909399;
}

.placeholder-tag {
  cursor: pointer;
  transition: all 0.2s;
}

.placeholder-tag:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.error-border :deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #f56c6c inset !important;
}

.import-config-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.import-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.import-tip {
  color: #909399;
  font-size: 12px;
}

/* 深色主题样式 */
:deep(.el-dialog) {
  background-color: #1e1e1e;
  border: 1px solid #404040;
}

/* 嵌套对话框样式 */
:deep(.nested-dialog) {
  background-color: #1e1e1e !important;
  border: 1px solid #404040 !important;
}

:deep(.nested-dialog .el-dialog__header) {
  background-color: #2d2d2d !important;
  border-bottom: 1px solid #404040 !important;
  color: #ffffff !important;
}

:deep(.nested-dialog .el-dialog__title) {
  color: #ffffff !important;
}

:deep(.nested-dialog .el-dialog__body) {
  background-color: #1e1e1e !important;
  color: #ffffff !important;
}

/* 嵌套对话框中的表单元素样式 */
:deep(.nested-dialog .el-form-item__label) {
  color: #e6e6e6 !important;
}

:deep(.nested-dialog .el-input__wrapper) {
  background-color: #2d2d2d !important;
  border: 1px solid #606266 !important;
}

:deep(.nested-dialog .el-input__inner) {
  background-color: transparent !important;
  color: #ffffff !important;
}

:deep(.nested-dialog .el-textarea__inner) {
  background-color: #2d2d2d !important;
  border: 1px solid #606266 !important;
  color: #ffffff !important;
}

:deep(.nested-dialog .el-checkbox__label) {
  color: #e6e6e6 !important;
}

:deep(.nested-dialog .el-checkbox__inner) {
  background-color: #2d2d2d !important;
  border-color: #606266 !important;
}

:deep(.el-dialog__header) {
  background-color: #2d2d2d;
  border-bottom: 1px solid #404040;
  color: #ffffff;
  padding: 15px 20px;
}

:deep(.el-dialog__title) {
  color: #ffffff;
}

:deep(.el-dialog__body) {
  background-color: #1e1e1e;
  color: #ffffff;
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

:deep(.el-table) {
  background-color: #1e1e1e;
  color: #ffffff;
}

:deep(.el-table th) {
  background-color: #2d2d2d;
  color: #ffffff;
  border-bottom: 1px solid #404040;
}

:deep(.el-table td) {
  border-bottom: 1px solid #404040;
}

/* 下拉框样式 */
:deep(.el-select) {
  width: 100%;
}

:deep(.el-select .el-input__wrapper) {
  background-color: #2d2d2d;
  border: 1px solid #606266;
  color: #ffffff;
}
</style>