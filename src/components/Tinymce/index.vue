<template>
  <div :class="{fullscreen:fullscreen}" v-loading="loading" class="tinymce-container" :style="{width:containerWidth}">
    <textarea :id="tinymceId" class="tinymce-textarea"/>
  </div>
</template>

<script>
  /**
   * docs:
   * https://panjiachen.github.io/vue-element-admin-site/feature/component/rich-editor.html#tinymce
   */
  import plugins from './plugins'
  import toolbar from './toolbar'
  import load from './dynamicLoadScript'
  import {uploadFile} from '@/api/qiniu'


  // why use this cdn, detail see https://github.com/PanJiaChen/tinymce-all-in-one
  const tinymceCDN = './tinymce/tinymce.min.js';

  export default {
    name: 'Tinymce',
    props: {
      id: {
        type: String,
        default: function () {
          return 'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
        }
      },
      value: {
        type: String,
        default: ''
      },
      toolbar: {
        type: Array,
        required: false,
        default() {
          return []
        }
      },
      menubar: {
        type: String,
        default: 'file edit insert view format table'
      },
      height: {
        type: [Number, String],
        required: false,
        default: 360
      },
      width: {
        type: [Number, String],
        required: false,
        default: 'auto'
      }
    },
    data() {
      return {
        loading: false,
        hasChange: false,
        hasInit: false,
        tinymceId: this.id,
        fullscreen: false
      }
    },
    computed: {
      containerWidth() {
        const width = this.width;
        if (/^[\d]+(\.[\d]+)?$/.test(width)) { // matches `100`, `'100'`
          return `${width}px`
        }
        return width
      }
    },
    watch: {
      value(val) {
        if (!this.hasChange && this.hasInit) {
          this.$nextTick(() =>
            window.tinymce.get(this.tinymceId).setContent(val || ''))
        }
      }
    },
    mounted() {
      this.init()
    },
    activated() {
      if (window.tinymce) {
        this.initTinymce()
      }
    },
    deactivated() {
      this.destroyTinymce()
    },
    destroyed() {
      this.destroyTinymce()
    },
    methods: {
      init() {
        this.loading = true;
        // dynamic load tinymce from cdn
        load(tinymceCDN, (err) => {
          if (err) {
            this.$message.error(err.message);
            return
          }
          this.initTinymce()
        })
      },
      initTinymce() {
        const _this = this;
        window.tinymce.init({
          selector: `#${this.tinymceId}`,
          language: 'zh_CN',
          height: this.height,
          body_class: 'panel-body ',
          object_resizing: false,
          toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
          menubar: this.menubar,
          plugins: plugins,
          end_container_on_empty_block: true,
          powerpaste_word_import: 'clean',
          code_dialog_height: 450,
          code_dialog_width: 1000,
          advlist_bullet_styles: 'square',
          advlist_number_styles: 'default',
          imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
          default_link_target: '_blank',
          link_title: false,
          nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
          browser_spellcheck: true, // 拼写检查
          branding: false, // 去水印
          elementpath: false,  //禁用编辑器底部的状态栏
          statusbar: false, // 隐藏编辑器底部的状态栏
          paste_data_images: false, // 允许粘贴图像
          init_instance_callback: editor => {
            if (_this.value) {
              editor.setContent(_this.value)
            }
            _this.hasInit = true;
            _this.loading = false;
            editor.on('NodeChange Change KeyUp SetContent', () => {
              this.hasChange = true;
              this.$emit('input', editor.getContent())
            })
          },
          setup(editor) {
            editor.on('FullscreenStateChanged', (e) => {
              _this.fullscreen = e.state
            })
          },
          images_upload_handler(blobInfo, success, failure, progress) {
            progress(0);
            const formData = new FormData();
            formData.append('file', blobInfo.blob());
            uploadFile(formData).then((res) => {
              if (res && res.data && res.data.attachment_uri) {
                let url = process.env.VUE_APP_BACKEND + res.data.attachment_uri;
                success(url);
                progress(100);
              } else {
                failure('出现未知问题，刷新页面，或者联系程序员');
              }
            }).catch(err => {
              failure('出现未知问题，刷新页面，或者联系程序员');
              console.log(err);
            });
            /*const img = 'data:image/jpeg;base64,' + blobInfo.base64();
            success(img)*/
          },
        })
      },
      destroyTinymce() {
        const tinymce = window.tinymce.get(this.tinymceId);
        if (this.fullscreen) {
          tinymce.execCommand('mceFullScreen')
        }

        if (tinymce) {
          tinymce.remove();
          tinymce.destroy();
        }
      },
      setContent(value) {
        window.tinymce.get(this.tinymceId).setContent(value)
      },
      getContent() {
        window.tinymce.get(this.tinymceId).getContent()
      }
    }
  }
</script>

<style scoped>
  .tinymce-container {
    position: relative;
    line-height: normal;
  }

  .tinymce-container >>> .mce-fullscreen {
    z-index: 10000;
  }

  .tinymce-textarea {
    visibility: hidden;
    z-index: -1;
  }

  .editor-custom-btn-container {
    position: absolute;
    right: 4px;
    top: 4px;
    /*z-index: 2005;*/
  }

  .fullscreen .editor-custom-btn-container {
    z-index: 10000;
    position: fixed;
  }

  .editor-upload-btn {
    display: inline-block;
  }
</style>
