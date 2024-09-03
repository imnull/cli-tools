export const CURSOR_STYLES = {
    /** 块状光标 */
    block: '\x1b[0 q',
    /** 下划线光标 */
    underline: '\x1b[4 q',
    /** 垂直线光标 */
    verticalBar: '\x1b[6 q',
    /** 重置为默认光标 */
    reset: '\x1b[ q',
}

export type TCursorStyle = keyof typeof CURSOR_STYLES
const overwrite = (msg: string, cursor: TCursorStyle = 'reset', backLines: number = 1) => {
    for(let i = 0; i < backLines; i++) {
        process.stdout.write('\x1b[2K');
        if (i < backLines - 1) {
            process.stdout.write('\x1b[A');
        }
    }
    process.stdout.write('\r');
    process.stdout.write(msg);
    process.stdout.write(CURSOR_STYLES[cursor]);
}

export class TermFlasher {
    private readonly history: string[]
    private readonly historyLimit: number = 10

    cursorInNewLine: boolean = false
    constructor() { 
        this.history = []
    }

    private renderHistory(msg: string) {
        this.history.unshift(msg)
        while(this.history.length > this.historyLimit) {
            this.history.pop()
        }
    }
    private getBackLines() {    
        const last = this.history[0] || ''
        const backLines = last.split('\n').length
        return backLines
    }

    private formatMsg(msg: string) {
        if (this.cursorInNewLine && msg && !msg.endsWith('\n')) {
            msg += '\n'
        }
        return msg
    }

    log(msg: string, cursor: TCursorStyle = 'reset') {
        const formatedMsg = this.formatMsg(msg)
        const backLines = this.getBackLines()
        overwrite(formatedMsg, cursor, backLines)
        this.renderHistory(msg)
    }
    reset() {
        this.log('', 'reset')
        this.history.splice(0, this.history.length)
    }
}