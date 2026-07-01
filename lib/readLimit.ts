type ReadLimit = {
    limit: number,
    time: number
}
type ReadLimitUser = {
    count: number,
    resetTime: number
}



export const store = new Map<string, ReadLimitUser>()

export function readLimit (key: string, params: ReadLimit){
    const now = Date.now()
    const current = store.get(key)

    if(!current || current.resetTime <= now) {
        store.set(key, {
            count: 1,
            resetTime: now + params.time
        })
        return {
            remLimit: params.limit - 1,
            resetTime: now + params.time
        }
    }

    if(current.count >= params.limit) {
        return {
            remLimit: 0,
            resetTime: current.resetTime
        }
    }

    current.count += 1
    store.set(key, current)

    return {
        remLimit: params.limit - current.count,
        resetTime: current.resetTime
    }
}