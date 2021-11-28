import React, {useEffect, useState} from "react";
import Form from "react-bootstrap/Form";
import {WidgetProps} from "@rjsf/core";
import axios from "axios";

const AutoCompleteWidget = (props: WidgetProps) => {
    const {
        id,
        placeholder,
        required,
        readonly,
        disabled,
        label,
        value,
        onChange,
        onBlur,
        onFocus,
        autofocus,
        options,
        schema,
        rawErrors = []
    } = props;

    const searchField = options.searchField ?? 'search'
    const responseField = options.responseField ?? 'text'
    const params = options?.params ?? ''

    const [examples, setExamples] = useState<string[]>([])

    const updateExamples = () => {
        if (options.webhook) {
            const url = `${options.webhook}?${searchField}=${value + params}`
            axios.get(url).then(res => res.data).then(res => setExamples(res.results)).catch(err => console.log(err))
        }
    }

    const _onChange = ({
                           target: {value},
                       }: React.ChangeEvent<HTMLInputElement>) => {
        updateExamples()
        return onChange(value === "" ? options.emptyValue : value)
    };
    const _onBlur = ({target: {value}}: React.FocusEvent<HTMLInputElement>) =>
        onBlur(id, value);
    const _onFocus = ({
                          target: {value},
                      }: React.FocusEvent<HTMLInputElement>) => onFocus(id, value);
    const inputType = (schema.type) === 'string' ? 'text' : `${schema.type}`

    return (
        <Form.Group className="mb-0">
            <Form.Label className={rawErrors.length > 0 ? "text-danger" : ""}>
                {label || schema.title}
                {(label || schema.title) && required ? "*" : null}
            </Form.Label>
            <Form.Control
                id={id}
                placeholder={placeholder}
                autoFocus={autofocus}
                required={required}
                disabled={disabled}
                readOnly={readonly}
                className={rawErrors.length > 0 ? "is-invalid" : ""}
                list={`examples_${id}`}
                type={inputType}
                value={value || value === 0 ? value : ""}
                onChange={_onChange}
                onBlur={_onBlur}
                onFocus={_onFocus}
            />
            {examples && examples.length > 0 ? (
                <datalist id={`examples_${id}`}>
                    {(examples as string[])
                        .map((example: any, index) => {
                            return <option key={`${example[responseField as string]}_${index}`} value={example[responseField as string]}/>;
                        })}
                </datalist>
            ) : null}
        </Form.Group>
    );
};

export default AutoCompleteWidget;