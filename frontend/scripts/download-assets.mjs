import { mkdir, writeFile } from 'node:fs/promises'
import { basename } from 'node:path'

const origin = 'http://172.16.40.152:8101'
const paths = [
  '/static/png/title-B750npxN.png', '/static/png/tixing-CY-31xhX.png',
  '/static/png/user-BzzvpSlb.png', '/static/png/arrow-iXRuH20Y.png',
  '/static/png/up_back-B_kR-02H.png', '/static/png/down_back-DulFU7YJ.png',
  '/static/png/homepage_back-C4LWuZQX.png', '/static/png/search-gevIyXGG.png',
  '/static/png/low_risk_icon-D4_C055t.png', '/static/png/mid_risk_icon-BulC-leb.png',
  '/static/png/high_risk_icon-piGds6KV.png', '/static/png/zhutizizhi-pzcQPxh-.png',
  '/static/png/guquanchuantou-BamKky2W.png', '/static/png/zhiliyurenyuan-mhOARYXp.png',
  '/static/png/falvyusifa-VJ5Pfu7P.png', '/static/png/xingzhengchufa-CZjOnGFA.png',
  '/static/png/yunyingjingying-C0YAAqoe.png', '/static/png/zhaotoubiao-CUk92NY5.png',
  '/static/png/touziyuziben-zcWl4FvG.png', '/static/png/caiwuyuzijin-ms625Hr4.png',
  '/static/png/zichanzhishi-3fUn3L9U.png', '/static/png/anquanhuanbao-DMO2rvIe.png',
  '/static/png/guanlianyuyuqing-Bh7f2dda.png'
]
await mkdir('public/assets', { recursive: true })
await Promise.all(paths.map(async (path) => {
  const response = await fetch(origin + path)
  if (!response.ok) throw new Error(`${response.status} ${path}`)
  await writeFile(`public/assets/${basename(path)}`, Buffer.from(await response.arrayBuffer()))
}))
console.log(`Downloaded ${paths.length} assets.`)
