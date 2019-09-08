<script>
import { mapGetters } from 'vuex'
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ])
  },
  render(h, context) {
    const { icon, title } = context.props;

    return [
      icon && h('el-icon', {
        props: {
          name: icon,
        },
        class: 'svg-icon'
      }),
      title && h('span', {
        slot: 'title',
        style: {
          'margin-left': icon ? 0 : '20px'
        }
      }, title)
    ]
  }
}
</script>
