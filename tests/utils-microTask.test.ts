import { microTask } from "../src/utils/microTask";

/**
 * 测试microTask
 */
describe("/utils/microTask", () => {
    test("call microTask", async  function () {
        const callback = jest.fn();

        microTask(callback);
        /** 测试异步, 此时不应该被调用 */
        expect(callback).toHaveBeenCalledTimes(0);

        /** 等待一下 */
        await new Promise<void>((resolve) => { setTimeout(resolve, 0) });

        /** 测试异步, 此时不应该被调用 */
        expect(callback).toHaveBeenCalledTimes(1);
    });
});