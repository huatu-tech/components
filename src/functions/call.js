export default function call(tel) {
  if (navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1) {
      // 安卓
      if (window.htoa) {
          window.htoa.CallPhone(tel)
      } else {
          window.location.href = `tel:${tel}`
      }
  } else {
      window.location.href = `tel:${tel}`
  }
}
