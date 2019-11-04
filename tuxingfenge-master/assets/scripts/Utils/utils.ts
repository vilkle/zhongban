export const Utils = {
    windowToCanvas (canvas, x, y) {
        const bbox = canvas.getBoundingClientRect() 
        return {
            // x: x - bbox.left * (canvas.width / bbox.width),
            // y: y - bbox.top * (canvas.height / bbox.height)
            x: x - bbox.left,
            y: y - bbox.top
        }
    },
    isPointsVeryClose (point1, point2) {
        return Utils.isVeryClose(point1.x, point2.x) && Utils.isVeryClose(point1.y, point2.y)
    },
    isVeryClose (x1, x2) {
        const gap = 0.1
        return Math.abs(x1 - x2)< gap
    },
    sortPoints(points) {
        return points.sort((point1, point2) => {
            if (Utils.isVeryClose(point1.x, point2.x)) {
                return point1.y - point2.y
            }
            return point1.x - point2.x
        })
    },
    getBoundingRect (graph) {
        const bbox = {
            left: 1e10,
            top: 1e10,
            right: 0,
            bottom: 0,
            width: 0,
            height: 0,
        }
        graph.forEach(unit => {
          unit.points.forEach(point => {
            bbox.left = Math.min(bbox.left, point.x)
            bbox.top = Math.min(bbox.top, point.y)
            bbox.right = Math.max(bbox.right, point.x)
            bbox.bottom = Math.max(bbox.bottom, point.y)
          })
        })
        bbox.width = bbox.right - bbox.left
        bbox.height = bbox.bottom - bbox.top
        return bbox
    }, 
    isPointInTriangle (p, [a, b, c]) {
        const pa = { x: a.x - p.x, y: a.y - p.y }
        const pb = { x: b.x - p.x, y: b.y - p.y }
        const pc = { x: c.x - p.x, y: c.y - p.y }
        const t1 = pa.x * pb.y - pa.y * pb.x
        const t2 = pb.x * pc.y - pb.y * pc.x
        const t3 = pc.x * pa.y - pc.y * pa.x
        return t1 * t2 >= 0 && t1 * t3 >=0
    },
    isPointInSquare (point, squarePoints) {
        const sorted = Utils.sortPoints(squarePoints)
        const { x, y } = point
        return y >= sorted[0].y && y <= sorted[1].y && x >= sorted[0].x && x <= sorted[2].x
    },

    rotateGraph (graph, degree) {
        // 旋转图形即旋转其每一个单元的每一个顶点
        return graph.map(unit => ({
            ...unit,
            points: unit.points.map(point => Utils.rotatePoint(point, degree))
        })) 
    },
    rotatePoint (point, degree) {
        return {
            x: Math.cos(degree) * point.x - Math.sin(degree) * point.y,
            y: Math.sin(degree) * point.x + Math.cos(degree) * point.y
        }
    },
    // 沿y轴翻折图形
    foldGraph (graph) {
        return graph.map(unit => ({
            ...unit,
            points: unit.points.map(point => Utils.foldPoint(point))
        }))
    },
    foldPoint (point) {
        return {
            x: -point.x,
            y: point.y
        }
    },
    isGraphEqual (graph1, graph2) {
        // 两个图形都平移到原点后再进行比较
        const moved1 = Utils.moveToOrigin(graph1)
        const moved2 = Utils.moveToOrigin(graph2)
        const sorted1 = Utils.sortUnitByCenter(moved1)
        const sorted2 = Utils.sortUnitByCenter(moved2)
        let equal = true
        for (let i = 0; i < sorted1.length; ++i) {
            if (!Utils.isUnitsEqual(sorted1[i], sorted2[i])){
                equal = false
                break
            }
        }
        return equal && Utils.isContainedTextEqual(graph1, graph2)
    },
    isContainedTextEqual (graph1, graph2) {
        let containedText1 = Utils.getContainedText(graph1).sort()
        let containedText2 = Utils.getContainedText(graph2).sort()
        if (containedText1.length != containedText2.length) return false
        let equal = true
        for (let i = 0; i < containedText1.length; ++i) {
            if (containedText1[i] != containedText2[i]) {
                return false
            }
        }
        return equal
    },
    getContainedText (graph) {
        return graph.filter(unit => unit.text).map(unit => unit.text)
    },
    // 是否两个图形重叠
    isGraphOverlapped (graph1, graph2) {
        const sorted1 = Utils.sortUnitByCenter(graph1)
        const sorted2 = Utils.sortUnitByCenter(graph2)
        let equal = true
        for (let i = 0; i < sorted1.length; ++i) {
            if (!Utils.isUnitsEqual(sorted1[i], sorted2[i])){
                equal = false
                break
            }
        }
        return equal
    },
    isUnitsEqual (unit1, unit2) {
        let equal = true
        const points1 = unit1.points
        const points2 = unit2.points
        for (let i = 0; i < points1.length; ++i) {
            if (!Utils.isPointsVeryClose(points1[i], points2[i])) {
                equal = false
                break
            }
        }
        return equal
    },
    sortUnitByCenter (graph) {
        return graph.sort((unit1, unit2) => {
            const center1 = Utils.getCenter(unit1.points)
            const center2 = Utils.getCenter(unit2.points)
            if (Utils.isVeryClose(center1.x, center2.x)) {
                return center1.y - center2.y
            }
            return center1.x - center2.x
        })
    },
    // 获得图形的重心
    getCenter (points) {
        // 这是正方形网格的情况
        if (points.length == 4) {
            const sorted = Utils.sortPoints(points)
            return {
                x: (sorted[0].x + sorted[2].x) / 2,
                y: (sorted[0].y + sorted[1].y) / 2
            }
        }
        // 这是三角形网格的情况
        if (points.length == 3) {
            const sorted = Utils.sortPoints(points)
            return {
                x: sorted[1].x,
                y: sorted[1].y + 2/3 * (sorted[0].y - sorted[1].y)
            }
        }
    },
    moveToOrigin (graph) {
        const bbox = Utils.getBoundingRect(graph)
        return graph.map(unit => ({
            ...unit,
            points: unit.points.map(point => ({
                x: point.x - bbox.left,
                y: point.y - bbox.top
            }))
        }))
    },
    movePointsToOrigin (points) {
        const bbox = Utils.getPointsBoundingRect(points)
        return points.map(point => ({
            x: point.x - bbox.left,
            y: point.y - bbox.top
        }))
    },
    getPointsBoundingRect(points) {
        const bbox = {
            left: 1e10,
            top: 1e10,
            right: 0,
            bottom: 0,
            width: 0,
            height: 0,
        }
        points.forEach(point => {
            bbox.left = Math.min(bbox.left, point.x)
            bbox.top = Math.min(bbox.top, point.y)
            bbox.right = Math.max(bbox.right, point.x)
            bbox.bottom = Math.max(bbox.bottom, point.y)
        })
        bbox.width = bbox.right - bbox.left
        bbox.height = bbox.bottom - bbox.top
        return bbox
    },
    // 将graph向左x，向上平移y
    move (graph, x, y) {
        return graph.map(unit => ({
            ...unit,
            points: unit.points.map(point => ({
                x: point.x - x,
                y: point.y - y
            }))
        }))
    },
    flatenArray (arrays) {
        let result = []
        if (arrays.length) {
            result =  arrays.reduce((res, curArr) => res.concat(curArr), [])
        }
        return result
    },
    // 每interval时间段内只允许调用一次
    throttle (fn, interval) {
        let _self = fn, timer = null

        return function () {
            let args = arguments, _me = this

            if (timer) {
                return false
            }

            _self.apply(_me, args)
            timer = setTimeout(() => {
                clearTimeout(timer)
                timer = null 
            }, interval || 500);
        }
    },
    IsPC () {
        var userAgentInfo = navigator.userAgent;
        var Agents = ["Android", "iPhone",
                    "SymbianOS", "Windows Phone",
                    "iPad", "iPod"];
        var flag = true;
        for (var i = 0; i < Agents.length; i++) {
            if (new RegExp(Agents[i], 'i').test(userAgentInfo)) {
                flag = false;
                break;
            }
        }
        return flag;
    }
}