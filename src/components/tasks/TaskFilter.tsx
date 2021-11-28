import React, {useEffect, useState} from "react";
import {Box, Button, FormControl, FormGroup, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import {Form} from "@rjsf/bootstrap-4";
import {chainsUrl, taskstagesUrl} from "../../config/Urls";
import Axios from "../../util/Axios";
import {WIDGETS} from "../../util/Util";

const TaskFilter = (props: { campaign: string, onFilter: (filter: string, stage: string) => void }) => {

    const {campaign, onFilter} = props;

    const [chainId, setChainId] = useState("")
    const [stageId, setStageId] = useState("")
    const [formStageId, setFormStageId] = useState("")
    const [chains, setChains] = useState([])
    const [stages, setStages] = useState([])
    const [jsonSchema, setJsonSchema] = useState({})
    const [uiSchema, setUiSchema] = useState({})
    const [formResponses, setFormResponses] = useState({})

    const widgets = WIDGETS

    useEffect(() => {
        Axios.get(`${chainsUrl}?campaign=${campaign}&limit=100`)
            .then(res => res.data)
            .then(res => setChains(res.results))
            .then(() => {
                if (!chainId) {
                    const savedChain = localStorage.getItem("selectable_filter_chain");
                    if (savedChain) {
                        setChainId(savedChain)
                    }
                }
            })
    }, [campaign])

    useEffect(() => {
        if (chainId && chains.length > 0) {
            Axios.get(`${taskstagesUrl}?chain=${chainId}&chain__campaign=${campaign}&limit=100`)
                .then(res => res.data)
                .then(res => setStages(res.results))
                .then(() => {
                    if (!formStageId) {
                        const savedStage = localStorage.getItem("selectable_filter_stage");
                        const savedFormStage = localStorage.getItem("selectable_filter_form_stage");
                        if (savedStage) {
                            setStageId(savedStage)
                        }
                        if (savedFormStage) {
                            setFormStageId(savedFormStage)
                        }
                    }
                })
        }
    }, [chainId])

    useEffect(() => {
        console.log(formStageId)
        if (formStageId && stages.length > 0) {
            const stage = stages.filter((item: any) => item.id == formStageId)[0] as any
            console.log(stage)
            if (stage) {
                const schema = stage.json_schema ? JSON.parse(stage.json_schema) : {}
                const ui = stage.ui_schema ? JSON.parse(stage.ui_schema) : {}
                setJsonSchema(schema)
                setUiSchema(ui)
                const savedResponses = localStorage.getItem("selectable_filter_responses");
                if (savedResponses) {
                    setFormResponses(JSON.parse(savedResponses))
                }
            }
        }
    }, [formStageId])


    const handleChainChange = (event: SelectChangeEvent) => {
        setChainId(event.target.value);
        setStageId("")
        setFormStageId("");
        setFormResponses({})
        setJsonSchema({})
        setUiSchema({})
        localStorage.setItem("selectable_filter_chain", event.target.value);
        localStorage.setItem("selectable_filter_stage", "");
        localStorage.setItem("selectable_filter_form_stage", "");
        localStorage.setItem("selectable_filter_responses", JSON.stringify({}));
    };

    const handleStageChange = (event: SelectChangeEvent) => {
        setStageId(event.target.value)
        localStorage.setItem("selectable_filter_stage", event.target.value);
    }

    const handleFormStageChange = (event: SelectChangeEvent) => {
        setFormStageId(event.target.value);
        setFormResponses({})
        setJsonSchema({})
        setUiSchema({})
        localStorage.setItem("selectable_filter_form_stage", event.target.value);
        localStorage.setItem("selectable_filter_responses", JSON.stringify({}));
    };

    const handleFormChange = (e: { formData: object }) => {
        setFormResponses(e.formData)
        localStorage.setItem("selectable_filter_responses", JSON.stringify(e.formData));
    }

    const handleFormSubmit = () => {
        const query = formStageId ? JSON.stringify({stage: formStageId, responses: formResponses}) : ""
        onFilter(query, stageId)
    };

    return (
        <FormGroup>
            <FormControl sx={{m: 1, minWidth: 120}}>
                <InputLabel id="select-chain-filter">Chain</InputLabel>
                <Select
                    labelId="select-chain-label"
                    id="select-chain"
                    value={chainId}
                    label="Chain"
                    onChange={handleChainChange}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {chains.map((item: any) => <MenuItem key={`filter_chain_${item.id}`}
                                                         value={item.id}>{item.name}</MenuItem>)}
                </Select>
            </FormControl>
            <FormControl disabled={chainId === ""} sx={{m: 1, minWidth: 120}}>
                <InputLabel id="select-stage-filter">Stage</InputLabel>
                <Select
                    labelId="select-stage-label"
                    id="select-stage"
                    value={stageId}
                    label="Stage"
                    onChange={handleStageChange}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {stages.map((item: any) => <MenuItem key={`filter_stage_${item.id}`}
                                                         value={item.id}>{item.name}</MenuItem>)}
                </Select>
            </FormControl>
            <FormControl disabled={chainId === ""} sx={{m: 1, minWidth: 120}}>
                <InputLabel id="select-form-stage-filter">Form Stage</InputLabel>
                <Select
                    labelId="select-stage-label"
                    id="select-stage"
                    value={formStageId}
                    label="Form Stage"
                    onChange={handleFormStageChange}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {stages.map((item: any) => <MenuItem key={`filter_form_stage_${item.id}`}
                                                         value={item.id}>{item.name}</MenuItem>)}
                </Select>
            </FormControl>
            <Box sx={{m: 1, minWidth: 120}}>
                <Form
                    schema={jsonSchema}
                    uiSchema={uiSchema}
                    widgets={widgets}
                    formData={formResponses}
                    children={" "}
                    onChange={handleFormChange}
                    onSubmit={handleFormSubmit}
                />
            </Box>
            <Button sx={{mx:1, mb: 2}} variant={"contained"} onClick={handleFormSubmit}>Search</Button>
        </FormGroup>
    );
};

export default TaskFilter