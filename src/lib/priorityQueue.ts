export interface PriorityQueueItem<T> {
  value: T;
  priority: number;
}

/**
 * Fila de prioridade maxima simples baseada em heap binario.
 * Usada para evidenciar o conceito de AED na ordenacao da rota de estudo.
 */
export class PriorityQueue<T> {
  private readonly heap: PriorityQueueItem<T>[] = [];

  enqueue(value: T, priority: number): void {
    this.heap.push({ value, priority });
    this.bubbleUp(this.heap.length - 1);
  }

  dequeue(): T | undefined {
    if (this.heap.length === 0) {
      return undefined;
    }

    const top = this.heap[0];
    const last = this.heap.pop();

    if (this.heap.length > 0 && last) {
      this.heap[0] = last;
      this.bubbleDown(0);
    }

    return top.value;
  }

  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  private bubbleUp(index: number): void {
    let currentIndex = index;

    while (currentIndex > 0) {
      const parentIndex = Math.floor((currentIndex - 1) / 2);

      if (this.heap[parentIndex].priority >= this.heap[currentIndex].priority) {
        return;
      }

      this.swap(parentIndex, currentIndex);
      currentIndex = parentIndex;
    }
  }

  private bubbleDown(index: number): void {
    let currentIndex = index;

    while (true) {
      const leftIndex = currentIndex * 2 + 1;
      const rightIndex = currentIndex * 2 + 2;
      let highestIndex = currentIndex;

      if (
        leftIndex < this.heap.length &&
        this.heap[leftIndex].priority > this.heap[highestIndex].priority
      ) {
        highestIndex = leftIndex;
      }

      if (
        rightIndex < this.heap.length &&
        this.heap[rightIndex].priority > this.heap[highestIndex].priority
      ) {
        highestIndex = rightIndex;
      }

      if (highestIndex === currentIndex) {
        return;
      }

      this.swap(currentIndex, highestIndex);
      currentIndex = highestIndex;
    }
  }

  private swap(firstIndex: number, secondIndex: number): void {
    [this.heap[firstIndex], this.heap[secondIndex]] = [
      this.heap[secondIndex],
      this.heap[firstIndex],
    ];
  }
}
