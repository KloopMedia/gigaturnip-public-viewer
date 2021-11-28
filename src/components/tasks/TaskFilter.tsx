import React, {useEffect, useState} from "react";
import {
    Box,
    Button,
    FormControl,
    FormGroup,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField
} from "@mui/material";
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
    const [searchValue, setSearchValue] = useState("")

    const widgets = WIDGETS

    useEffect(() => {
        Axios.get(`${taskstagesUrl}public/`)
            .then(res => res.data)
            .then(res => setStages(res))
    }, [chainId])

    // useEffect(() => {
    //     console.log(formStageId)
    //     if (formStageId && stages.length > 0) {
    //         const stage = stages.filter((item: any) => item.id == formStageId)[0] as any
    //         console.log(stage)
    //         if (stage) {
    //             const schema = stage.json_schema ? JSON.parse(stage.json_schema) : {}
    //             const ui = stage.ui_schema ? JSON.parse(stage.ui_schema) : {}
    //             setJsonSchema(schema)
    //             setUiSchema(ui)
    //             const savedResponses = localStorage.getItem("selectable_filter_responses");
    //             if (savedResponses) {
    //                 setFormResponses(JSON.parse(savedResponses))
    //             }
    //         }
    //     }
    // }, [formStageId])


    // const handleChainChange = (event: SelectChangeEvent) => {
    //     setChainId(event.target.value);
    //     setStageId("")
    //     setFormStageId("");
    //     setFormResponses({})
    //     setJsonSchema({})
    //     setUiSchema({})
    //     localStorage.setItem("selectable_filter_chain", event.target.value);
    //     localStorage.setItem("selectable_filter_stage", "");
    //     localStorage.setItem("selectable_filter_form_stage", "");
    //     localStorage.setItem("selectable_filter_responses", JSON.stringify({}));
    // };

    const handleStageChange = (event: SelectChangeEvent) => {
        setStageId(event.target.value)
    }

    // const handleFormStageChange = (event: SelectChangeEvent) => {
    //     setFormStageId(event.target.value);
    //     setFormResponses({})
    //     setJsonSchema({})
    //     setUiSchema({})
    //     localStorage.setItem("selectable_filter_form_stage", event.target.value);
    //     localStorage.setItem("selectable_filter_responses", JSON.stringify({}));
    // };

    // const handleFormChange = (e: { formData: object }) => {
    //     setFormResponses(e.formData)
    //     localStorage.setItem("selectable_filter_responses", JSON.stringify(e.formData));
    // }

    const handleFormSubmit = () => {
        // const query = formStageId ? JSON.stringify({stage: formStageId, responses: formResponses}) : ""
        const query = searchValue
        onFilter(query, stageId)
    };

    const handleSearchValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value)
    }

    return (
        <FormGroup>
            <Box sx={{m: 1, minWidth: 120}}>
                <TextField
                    id="outlined-basic"
                    label="Поиск"
                    variant="outlined"
                    fullWidth
                    onChange={handleSearchValueChange}/>
            </Box>
            {/*<FormControl sx={{m: 1, minWidth: 120}}>*/}
            {/*    <InputLabel id="select-chain-filter">Chain</InputLabel>*/}
            {/*    <Select*/}
            {/*        labelId="select-chain-label"*/}
            {/*        id="select-chain"*/}
            {/*        value={chainId}*/}
            {/*        label="Chain"*/}
            {/*        onChange={handleChainChange}*/}
            {/*    >*/}
            {/*        <MenuItem value="">*/}
            {/*            <em>None</em>*/}
            {/*        </MenuItem>*/}
            {/*        {chains.map((item: any) => <MenuItem key={`filter_chain_${item.id}`}*/}
            {/*                                             value={item.id}>{item.name}</MenuItem>)}*/}
            {/*    </Select>*/}
            {/*</FormControl>*/}
            <FormControl sx={{m: 1, minWidth: 120}}>
                <InputLabel id="select-stage-filter">Форма</InputLabel>
                <Select
                    labelId="select-stage-label"
                    id="select-stage"
                    value={stageId}
                    label="Форма"
                    onChange={handleStageChange}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {stages.map((item: any) => <MenuItem key={`filter_stage_${item.id}`}
                                                         value={item.id}>{item.name}</MenuItem>)}
                </Select>
            </FormControl>
            {/*<FormControl disabled={chainId === ""} sx={{m: 1, minWidth: 120}}>*/}
            {/*    <InputLabel id="select-form-stage-filter">Form Stage</InputLabel>*/}
            {/*    <Select*/}
            {/*        labelId="select-stage-label"*/}
            {/*        id="select-stage"*/}
            {/*        value={formStageId}*/}
            {/*        label="Form Stage"*/}
            {/*        onChange={handleFormStageChange}*/}
            {/*    >*/}
            {/*        <MenuItem value="">*/}
            {/*            <em>None</em>*/}
            {/*        </MenuItem>*/}
            {/*        {stages.map((item: any) => <MenuItem key={`filter_form_stage_${item.id}`}*/}
            {/*                                             value={item.id}>{item.name}</MenuItem>)}*/}
            {/*    </Select>*/}
            {/*</FormControl>*/}
            {/*<Box sx={{m: 1, minWidth: 120}}>*/}
            {/*    <Form*/}
            {/*        schema={jsonSchema}*/}
            {/*        uiSchema={uiSchema}*/}
            {/*        widgets={widgets}*/}
            {/*        formData={formResponses}*/}
            {/*        children={" "}*/}
            {/*        onChange={handleFormChange}*/}
            {/*        onSubmit={handleFormSubmit}*/}
            {/*    />*/}
            {/*</Box>*/}
            <Button sx={{mx: 1, mb: 2}} variant={"contained"} onClick={handleFormSubmit}>Поиск</Button>
        </FormGroup>
    );
};

export default TaskFilter