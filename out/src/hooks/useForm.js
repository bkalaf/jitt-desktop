"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useForm = void 0;
const react_1 = require("react");
const ignore_1 = require("../components/ignore");
function useForm(convert) {
    const formRef = (0, react_1.useRef)(null);
    const controls = (0, react_1.useRef)(new Map());
    const unregister = (0, react_1.useCallback)((key) => {
        var _a;
        (_a = controls.current) === null || _a === void 0 ? void 0 : _a.delete(key);
    }, []);
    const register = (0, react_1.useCallback)((name, opts) => {
        var _a;
        const newOpts = Object.assign(Object.assign({}, (opts !== null && opts !== void 0 ? opts : {})), { validators: (_a = opts === null || opts === void 0 ? void 0 : opts.validators) !== null && _a !== void 0 ? _a : [] });
        controls.current.set(name, newOpts);
        return { name, id: name };
    }, []);
    const validate = (0, react_1.useCallback)(() => {
        if (formRef.current == null)
            throw new Error('formref not set');
        if (controls.current == null)
            throw new Error('controls not set');
        const getElement = (name) => formRef.current.elements.namedItem(name);
        Array.from(controls.current.keys()).map((key) => {
            const { validators } = controls.current.get(key);
            const el = getElement(key);
            const result = validators.map((str) => eval(str)(el.value));
            const msgs = result.filter((x) => typeof x === 'string');
            const message = msgs.join('\n');
            el.setCustomValidity(message);
        });
        return formRef.current.reportValidity();
    }, []);
    const handleSubmit = (0, react_1.useCallback)((onSubmit, onSuccess = ignore_1.ignore, onFailure = ignore_1.ignore) => {
        return function (ev) {
            ev.preventDefault();
            try {
                if (formRef.current == null)
                    throw new Error('formref not set');
                const formData = new FormData(formRef.current);
                if (!validate())
                    throw new Error('Did not pass validation');
                const result = onSubmit(convert(formData));
                result.then(onSuccess).catch(onFailure);
            }
            catch (error) {
                onFailure(error);
                console.error(error.message);
                process.stdout.write(error.message);
            }
        };
    }, [convert, validate]);
    return [handleSubmit, register, formRef];
}
exports.useForm = useForm;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlRm9ybS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ob29rcy91c2VGb3JtLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpQ0FBNEM7QUFFNUMsaURBQThDO0FBSzlDLFNBQWdCLE9BQU8sQ0FDbkIsT0FBb0M7SUFVcEMsTUFBTSxPQUFPLEdBQUcsSUFBQSxjQUFNLEVBQXlCLElBQUksQ0FBQyxDQUFDO0lBQ3JELE1BQU0sUUFBUSxHQUFHLElBQUEsY0FBTSxFQUFxQyxJQUFJLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDdkUsTUFBTSxVQUFVLEdBQUcsSUFBQSxtQkFBVyxFQUFDLENBQUMsR0FBVyxFQUFFLEVBQUU7O1FBQzNDLE1BQUEsUUFBUSxDQUFDLE9BQU8sMENBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2xDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNQLE1BQU0sUUFBUSxHQUFHLElBQUEsbUJBQVcsRUFBQyxDQUFDLElBQVksRUFBRSxJQUFrQixFQUFFLEVBQUU7O1FBQzlELE1BQU0sT0FBTyxtQ0FBUSxDQUFDLElBQUksYUFBSixJQUFJLGNBQUosSUFBSSxHQUFJLEVBQUUsQ0FBQyxLQUFFLFVBQVUsRUFBRSxNQUFBLElBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxVQUFVLG1DQUFJLEVBQUUsR0FBRSxDQUFDO1FBQ3hFLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNwQyxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQztJQUM5QixDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDUCxNQUFNLFFBQVEsR0FBRyxJQUFBLG1CQUFXLEVBQUMsR0FBRyxFQUFFO1FBQzlCLElBQUksT0FBTyxDQUFDLE9BQU8sSUFBSSxJQUFJO1lBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQkFB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