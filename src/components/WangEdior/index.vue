<template>
    <div class="m-wangEditor">
        <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :default-config="toolbarConfig" :mode="mode" />
        <Editor
            v-model="valueHtml"
            class="editor-content'"
            :style="{ minHeight: showImg ? '301px' : '500px', overflow: 'hidden' }"
            :default-config="editorConfig"
            :mode="mode"
            @on-created="handleCreated"
        />
    </div>
</template>
<script lang="ts" setup>
    // 引入 wangEditor
    import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
    import '@wangeditor/editor/dist/css/style.css' // 引入 css
    import { useRoute } from 'vue-router'
    import { onBeforeUnmount, onMounted, watch, shallowRef, ref, computed } from 'vue'
    let editors = null
    const route = useRoute()
    // 编辑器实例，必须用 shallowRef
    const editorRef = shallowRef()

    const toolbarConfig = {}
    if (route.path == '/dian/list' || route.path == '/fu/list') {
        toolbarConfig.excludeKeys = ['group-video', 'codeBlock', 'insertTable']
    } else {
        toolbarConfig.excludeKeys = ['group-image', 'group-video', 'codeBlock', 'insertTable']
    }
    const editorConfig = { placeholder: '请输入50-200字符之间...', MENU_CONF: {} }
    editorConfig.MENU_CONF['uploadImage'] = {
        server: 'https://api.ustudygroup.com/api/v1/Sign/fileAdd',
        fieldName: 'file',
        // 单个文件的最大体积限制，默认为 5M
        maxFileSize: 5 * 1024 * 1024, // 1M

        // 最多可上传几个文件，默认为 100
        // maxNumberOfFiles: 10,

        // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
        allowedFileTypes: ['image/*'],

        // 自定义上传参数，例如传递验证的 token 等。参数会被添加到 formData 中，一起上传到服务端。
        // meta: {
        //     token: 'xxx',
        //     otherKey: 'yyy',
        // },

        // 将 meta 拼接到 url 参数中，默认 false
        // metaWithUrl: false,

        // // 自定义增加 http  header
        // headers: {
        //     Accept: 'text/x-json',
        //     otherKey: 'xxx',
        // },

        // 跨域是否传递 cookie ，默认为 false
        // withCredentials: true,

        // 超时时间，默认为 10 秒
        timeout: 5 * 1000, // 5 秒
        customInsert(res: any, insertFn: InsertFnType) {
            console.log(res, '我是富文本')

            // TS 语法
            // customInsert(res, insertFn) {                  // JS 语法
            // res 即服务端的返回结果

            // 从 res 中找到 url alt href ，然后插入图片
            let url = res.data.url_path
            let alt = res.data.url_path
            let href = res.data.url_path
            insertFn(url, alt, href)
        },
    }
    // 内容 HTML
    const mode = ref('default')
    let emit = defineEmits(['update:modelValue'])
    let props = defineProps({
        modelValue: String,
        showImg: Boolean,
    })

    const getEditorData = () => {
        // 通过代码获取编辑器内容
        let data = editors.txt.html()
        alert(data)
    }

    const handleCreated = (editor) => {
        editorRef.value = editor // 记录 editor 实例，重要！
    }

    const valueHtml = computed({
        get() {
            return props.modelValue
        },
        set(val) {
            // 防止富文本内容为空时，校验失败
            if (editorRef.value.isEmpty()) val = ''
            emit('update:modelValue', val)
        },
    })

    // 组件销毁时，也及时销毁编辑器
    onBeforeUnmount(() => {
        // 调用销毁 API 对当前编辑器实例进行销毁
        const editor = editorRef.value
        if (editor == null) {
            return
        }
        editor.destroy()
    })
</script>
<style lang="scss" scoped>
    .m-wangEditor {
        z-index: 0;
        width: 100%;
        border: 1px solid #cccccc;
        .editor-toolbar {
            border-bottom: 1px solid #cccccc;
        }
        .editor-content {
            overflow-y: auto; /* 或者 visible */
        }
    }
    .editor-content img {
        max-width: 100%;
    }
    .w-e-full-screen-container {
        z-index: 999;
    }
</style>
