var assert = require('chai').assert;
var PriorityQueue = require('../lib/PriorityQueue');

describe('PriorityQueue', function() {

    it('Should work just like the Android version', function() {
        var pq = new PriorityQueue({
            comparator: function(a, b) {
                return b - a;
            }
        });
        pq.offer(64516);

        assert.strictEqual(pq.poll(), 64516);
        pq.offer(15876);
        pq.offer(16770);
        assert.deepEqual(pq._elements, [
            16770,
            15876
        ]);

        assert.strictEqual(pq.poll(), 16770);
        pq.offer(4290);
        pq.offer(4290);
        assert.deepEqual(pq._elements, [
            15876,
            4290,
            4290
        ]);

        assert.strictEqual(pq.poll(), 15876);
        pq.offer(3906);
        pq.offer(4160);
        assert.deepEqual(pq._elements, [
            4290,
            4290,
            3906,
            4160
        ]);

        assert.strictEqual(pq.poll(), 4290);
        pq.offer(1122);
        pq.offer(1122);
        assert.deepEqual(pq._elements, [
            4290,
            4160,
            3906,
            1122,
            1122
        ]);

        assert.strictEqual(pq.poll(), 4290);
        pq.offer(1089);
        pq.offer(1122);
        assert.deepEqual(pq._elements, [
            4160,
            1122,
            3906,
            1122,
            1089,
            1122
        ]);

        assert.strictEqual(pq.poll(), 4160);
        pq.offer(900);
        pq.offer(1296);
        assert.deepEqual(pq._elements, [
            3906,
            1122,
            1296,
            1122,
            1089,
            900,
            1122
        ]);

        assert.strictEqual(pq.poll(), 3906);
        pq.offer(900);
        pq.offer(1122);
        assert.deepEqual(pq._elements, [
            1296,
            1122,
            1122,
            1122,
            1089,
            900,
            900,
            1122
        ]);

        assert.strictEqual(pq.poll(), 1296);
        pq.offer(399);
        pq.offer(306);
        assert.deepEqual(pq._elements, [
            1122,
            1122,
            1122,
            1122,
            1089,
            900,
            900,
            399,
            306
        ]);

        assert.strictEqual(pq.poll(), 1122);
        pq.offer(324);
        pq.offer(289);
        assert.deepEqual(pq._elements, [
            1122,
            1122,
            1122,
            399,
            1089,
            900,
            900,
            306,
            324,
            289
        ]);

        assert.strictEqual(pq.poll(), 1122);
        pq.offer(306);
        pq.offer(306);

        assert.deepEqual(pq._elements, [
            1122,
            1089,
            1122,
            399,
            306,
            900,
            900,
            306,
            324,
            289,
            306
        ]);

        assert.strictEqual(pq.poll(), 1122);
        pq.offer(306);
        pq.offer(306);
        assert.deepEqual(pq._elements, [
            1122,
            1089,
            900,
            399,
            306,
            306,
            900,
            306,
            324,
            289,
            306,
            306
        ]);

        assert.strictEqual(pq.poll(), 1122);
        pq.offer(225);
        pq.offer(306);
        assert.deepEqual(pq._elements, [
            1089,
            399,
            900,
            324,
            306,
            306,
            900,
            306,
            306,
            289,
            306,
            225,
            306
        ]);

        assert.strictEqual(pq.poll(), 1089);
        pq.offer(210);
        pq.offer(306);
        assert.deepEqual(pq._elements, [
            900,
            399,
            900,
            324,
            306,
            306,
            306,
            306,
            306,
            289,
            306,
            225,
            210,
            306
        ]);

        assert.strictEqual(pq.poll(), 900);
        pq.offer(196);
        pq.offer(306);
        assert.deepEqual(pq._elements, [
            900,
            399,
            306,
            324,
            306,
            306,
            306,
            306,
            306,
            289,
            306,
            225,
            210,
            196,
            306
        ]);

        assert.strictEqual(pq.poll(), 900);
        pq.offer(196);
        pq.offer(288);
        assert.deepEqual(pq._elements, [
            399,
            324,
            306,
            306,
            306,
            306,
            306,
            306,
            306,
            289,
            306,
            225,
            210,
            196,
            196,
            288
        ]);

    });
});
