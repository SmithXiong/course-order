<script>
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
  render(h, context) {
    const { icon, title } = context.props

    return [
      icon && h('el-icon', {
        props: {
          name: icon
        }
      }),
      title && h('span', {
        style: {
          'margin-left': icon ? 0 : '10px'
        }
      }, title)
    ]
  }
}
</script>
