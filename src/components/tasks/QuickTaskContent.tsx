import React, {useEffect, useState} from "react";
import Form from "@rjsf/bootstrap-4";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Grid} from "@mui/material";
import {getPreviousTasks, WIDGETS} from "../../util/Util";

type QuickTaskContentParams = { id: string, taskData: any, isAssigned: boolean, handleAssignment: (value: boolean) => void, integrated?: boolean, refreshTasks?: () => void }

const QuickTaskContent = (props: QuickTaskContentParams) => {
    const {id, taskData, isAssigned} = props;

    const [schema, setSchema] = useState({})
    const [uiSchema, setUiSchema] = useState({})
    const [formResponses, setFormResponses] = useState<any>({})
    const [complete, setComplete] = useState(false)
    const [prevTasks, setPrevTasks] = useState<any>([])

    const widgets = WIDGETS

    useEffect(() => {
        const setData = async () => {
            const task = taskData
            const stage = task.stage

            console.log(task)

            let parsed_schema = stage.json_schema ? JSON.parse(stage.json_schema) : {}
            let parsed_ui = stage.ui_schema ? JSON.parse(stage.ui_schema) : {}

            const prev: any = task.displayed_prev_tasks ? task.displayed_prev_tasks : []

            const previousTasks = prev.map((task: any) => ({
                responses: task.responses,
                json_schema: task.stage.json_schema ? JSON.parse(task.stage.json_schema) : {},
                ui_schema: task.stage.ui_schema ? JSON.parse(task.stage.ui_schema) : {}
            }))

            console.log("previousTasks", previousTasks)

            setPrevTasks(previousTasks)
            setFormResponses(task.responses)
            setSchema(parsed_schema)
            setUiSchema(parsed_ui)
            setComplete(task.complete)
        }
        if (taskData) {
            setData()
        }
    }, [taskData])

    return (
        <Grid container>
            <Grid direction='row' container spacing={1}>
                {prevTasks?.length > 0 &&
                <Grid container item sm={6} xs={12} sx={{display: 'block'}}>
                    {prevTasks.map((task: any, i: number) =>
                        <Form
                            key={`prev_task_${i}`}
                            schema={task.json_schema ?? {}}
                            uiSchema={task.ui_schema ?? {}}
                            formData={task.responses ?? {}}
                            widgets={widgets}
                            disabled={true}
                            children={" "}
                        />
                    )}
                </Grid>
                }
                <Grid container item sm={prevTasks?.length > 0 ? 6 : 12} xs={12} sx={{display: 'block'}}>
                    <Form
                        schema={schema ?? {}}
                        uiSchema={uiSchema ?? {}}
                        formData={formResponses ?? {}}
                        liveOmit={true}
                        omitExtraData={true}
                        widgets={widgets}
                        disabled={true}
                    > </Form>
                </Grid>
            </Grid>
        </Grid>
    )
}


export default QuickTaskContent
