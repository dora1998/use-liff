export const importByScriptTag = (src: string): Promise<void> =>
  new Promise<void>((resolve) => {
    const script = document.createElement('script')
    script.src = src
    script.type = 'text/javascript'
    script.charset = 'utf-8'
    script.async = true
    script.onload = () => resolve()
    document.head.appendChild(script)
  })
