import { toPng, toSvg } from 'html-to-image'

interface Props {
  targetId: string
  filename: string
}

export function ExportButton({ targetId, filename }: Props) {
  const exportPng = async () => {
    const el = document.getElementById(targetId)
    if (!el) return
    try {
      const dataUrl = await toPng(el, { pixelRatio: 2, backgroundColor: '#ffffff' })
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = `${filename}.png`
      a.click()
    } catch (e) {
      console.error('Export failed', e)
    }
  }

  const exportSvg = async () => {
    const el = document.getElementById(targetId)
    if (!el) return
    try {
      const dataUrl = await toSvg(el)
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = `${filename}.svg`
      a.click()
    } catch (e) {
      console.error('Export failed', e)
    }
  }

  return (
    <div className="export-buttons">
      <button className="btn-export" onClick={exportPng}>PNG書き出し</button>
      <button className="btn-export btn-export-svg" onClick={exportSvg}>SVG書き出し</button>
    </div>
  )
}
