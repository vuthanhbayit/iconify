import type { IconifyJSON } from '@iconify/types'
import { IconSet } from '@iconify/tools'
import { optimize } from 'svgo'
import { clearUndefined, map } from '@vt7/utils'

export const parseIconifyJSON = (collection: IconifyJSON, transformAttrs: Record<string, any>) => {
  const iconSet = new IconSet(collection)

  iconSet.forEachSync((name, type) => {
    if (type !== 'icon') return

    const svg = iconSet.toSVG(name)

    if (!svg) {
      // Invalid icon
      iconSet.remove(name)
      return
    }

    try {
      const result = optimize(svg.toString(), {
        plugins: [
          {
            name: 'removeAttrs',
            params: {
              attrs: Object.keys(transformAttrs),
            },
          },
          {
            name: 'addAttributesToSVGElement',
            params: {
              attributes: Object.values(
                map(clearUndefined(transformAttrs), (value, key) => {
                  return { [key]: value }
                }),
              ),
            },
          },
        ],
      })

      svg.load(result.data)
    } catch (e) {
      iconSet.remove(name)
      return
    }

    // Update icon
    iconSet.fromSVG(name, svg)
  })

  return iconSet.export()
}
