import axios from "./Axios";
import {campaignsUrl, notificationsUrl, taskstagesUrl, tasksUrl} from "../config/Urls";
import CustomFileWidget from "../components/custom-widgets/file-widget/CustomFileWidget";
import AutoCompleteWidget from "../components/custom-widgets/autocomplete/AutoCompleteWidget";
import FixedRadioWidget from "../components/custom-widgets/fixed-radio-widget/FixedRadioWidget";
import CustomLinkWidget from "../components/custom-widgets/link-widget/CustomLinkWidget";

export const IS_PAGINATION_ON = false
export const WIDGETS = {
    customfile: CustomFileWidget,
    autocomplete: AutoCompleteWidget,
    RadioWidget: FixedRadioWidget,
    customlink: CustomLinkWidget
};

// Pagination Functions
export const paginatedDataHandler = (
    data: any,
    setDataFunction: (res: any) => void,
    setCountFunction: (count: number) => void,
) => {
    const {results, count} = data;
    const numOfPages = Math.ceil(count / 10)
    console.log("numOfPages", numOfPages)
    console.log("results", results)
    setDataFunction(results)
    setCountFunction(numOfPages)
}

const createPaginationURL = (request: string, page?: number) => {
    if (page && page > 0) {
        return `${request}?limit=10&offset=${(page - 1) * 10}`
    } else {
        return request
    }
}

// Date Functions
export const formatDateString = (date: string) => {
    const d = new Date(date)
    const year = d.getFullYear()
    const month = addZeroesToDate(d.getMonth() + 1)
    const day = addZeroesToDate(d.getDate())
    const hours = addZeroesToDate(d.getHours())
    const minutes = addZeroesToDate(d.getMinutes())
    const seconds = addZeroesToDate(d.getSeconds())
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
}

const addZeroesToDate = (date: number) => {
    return date < 10 ? '0' + date : date
}

// Tab function
export const a11yProps = (index: any) => ({
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
});

// Campaigns Functions
export const getCampaigns = () => {
    return axios.get(campaignsUrl)
        .then(res => res.data)
        .then(res => {
            console.log(res)
            return IS_PAGINATION_ON ? res.results : res
        })
}

export const getUserCampaigns = () => {
    return axios.get(campaignsUrl + 'list_user_campaigns/')
        .then(res => res.data)
        .then(res => {
            console.log("user_campaigns", res)
            return IS_PAGINATION_ON ? res.results : res
        })
}

export const getSelectableCampaigns = () => {
    return axios.get(campaignsUrl + 'list_user_selectable/')
        .then(res => res.data)
        .then(res => {
            console.log("selectable_campaigns", res)
            return IS_PAGINATION_ON ? res.results : res
        })
}

export const requestCampaignJoin = (id: string | number) => {
    return axios.post(campaignsUrl + id + '/join_campaign/')
}

export const requestCampaignInfo = (id: string | number) => {
    return axios.get(campaignsUrl + id + '/')
        .then(res => res.data)
}


// TaskCard Functions
export const requestTaskCreation = (id: string | number) => {
    return axios.post(taskstagesUrl + id + '/create_task/')
        .then(res => res.data)
}

export const requestTaskAssignment = (id: string | number) => {
    return axios.post(tasksUrl + id + '/request_assignment/')
}


// TaskMenu Functions
export const getSelectableTasks = (campaignId: string | number, page?: number, filter?: {query?: string, stage?: string} | null) => {
    console.log(page)
    let url = createPaginationURL(`${tasksUrl}public/`, page) + '&ordering=created_at'
    if (filter) {
        if (filter.query) {
            url += `&search=${filter.query}`
        }
        if (filter.stage) {
            url += `&stage=${filter.stage}`
        }
        // url = `${tasksUrl}?task_responses=${filter.query}`
    }
    console.log("SELECTABLE URL", url)
    return axios.get(url).then(res => {
        console.log("getSelectableTasks", res.data)
        return res.data;
    })
};

export const getCompleteTasks = (campaignId: string | number) => {
    return axios.get(`${tasksUrl}user_relevant/?complete=${true}&stage__chain__campaign=${campaignId}`)
        .then(res => res.data)
        .then(res => {
            console.log("getCompleteTasks", res)
            return (res)
        })
};

export const getOpenTasks = (campaignId: string | number) => {
    return axios.get(`${tasksUrl}user_relevant/?complete=${false}&stage__chain__campaign=${campaignId}`)
        .then(res => res.data)
        .then(res => {
            console.log("getOpenTasks", res)
            return (res)
        })
};

export const getCreatableTasks = (campaignId: string | number) => {
    return axios.get(`${taskstagesUrl}user_relevant/?chain__campaign=${campaignId}`)
        .then(res => res.data)
};


// Task Functions
export const getPreviousTasks = (id: string | number) => {
    return axios.get(`${tasksUrl + id}/list_displayed_previous/`)
        .then(res => res.data)
}

export const getTask = (id: string | number) => {
    return axios.get(`${tasksUrl + id}/`).then((res: any) => res.data)
}


// Notifications Functions
export const getUserNotifications = (campaignId: string | number, viewed: boolean, importance?: number, page?: number) => {
    console.log(page)
    const url = createPaginationURL(`${notificationsUrl}list_user_notifications/?campaign=${campaignId}&viewed=${viewed}`, page)
    console.log("IMPORTANCE", importance)
    if (importance === 0) {
        return axios.get(`${url}&importance=${importance}`)
            .then(res => res.data)
    } else {
        return axios.get(url)
            .then(res => res.data)
    }
}

export const getNotificationContent = (id: string | number) => {
    return axios.get(`${notificationsUrl + id}/`).then(res => res.data)
}