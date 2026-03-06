const MAX_BYTES = 1024 * 1024 // 1 MB

export class RingBuffer {
  private chunks: Buffer[] = []
  private totalBytes = 0

  push(data: Buffer | string): void {
    const buf = typeof data === 'string' ? Buffer.from(data) : data
    this.chunks.push(buf)
    this.totalBytes += buf.length
    this.trim()
  }

  getAll(): Buffer {
    return Buffer.concat(this.chunks)
  }

  private trim(): void {
    while (this.totalBytes > MAX_BYTES && this.chunks.length > 1) {
      const removed = this.chunks.shift()!
      this.totalBytes -= removed.length
    }
  }
}
