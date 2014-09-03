function PriorityQueue(options) {
    this._elements = [];
    this._comparator = function(a, b) {
        return a - b;
    };
    if (options.comparator !== undefined) {
        this._comparator = options.comparator;
    }
}

PriorityQueue.prototype._siftUp = function(childIndex) {
    var target = this._elements[childIndex];
    var parentIndex;
    while (childIndex > 0) {
        parentIndex = Math.floor((childIndex - 1) / 2);
        var parent = this._elements[parentIndex];
        if (this._comparator(parent, target) <= 0) {
            break;
        }
        this._elements[childIndex] = parent;
        childIndex = parentIndex;
    }

    this._elements[childIndex] = target;
};

PriorityQueue.prototype._siftDown = function(rootIndex) {
    var size = this._elements.length;

    var target = this._elements[rootIndex];
    var childIndex;
    while ((childIndex = rootIndex * 2 + 1) < size) {
        if (childIndex + 1 < size
            && this._comparator(this._elements[childIndex + 1], this._elements[childIndex]) < 0) {
            childIndex++;
        }
        if (this._comparator(target, this._elements[childIndex]) <= 0) {
            break;
        }
        this._elements[rootIndex] = this._elements[childIndex];
        rootIndex = childIndex;
    }
    this._elements[rootIndex] = target;
};

PriorityQueue.prototype._removeAt = function(index) {
    var moved = this._elements.pop();
    if (this._elements.length === 0) {
        return;
    }
    this._elements[index] = moved;

    this._siftDown(index);
    //if (moved == this._elements[index]) {
    //    this._siftUp(index);
    //}
};

PriorityQueue.prototype.offer = function(item) {
    this._elements.push(item);
    this._siftUp(this._elements.length - 1);
};

PriorityQueue.prototype.poll = function() {
    var result = this._elements[0];
    this._removeAt(0);
    return result;
};

PriorityQueue.prototype.peek = function() {
    return this._elements[0];
};

PriorityQueue.prototype.size = function() {
    return this._elements.length;
};

module.exports = PriorityQueue;
