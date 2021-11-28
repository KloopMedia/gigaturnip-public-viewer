
// Base Types
import React from "react";

type ID = { id: number }
type CAMPAIGN = { campaign: number }
type NameAndDescription = { name: string, description?: string }

// Exported Types
export type RouterParams = { id: string, campaignId: string, chainId: string }
export type AppbarParams = { children: React.ReactNode }

export type CreateCampaignParams = NameAndDescription
export type CampaignParams = ID & CreateCampaignParams

export type CreateChainParams = NameAndDescription & CAMPAIGN
export type ChainParams = ID & CreateChainParams

export type DialogParams = {
    title: string;
    open: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
}

export type PreviewFormParams = {
    jsonSchema: string,
    uiSchema: string,
    formResponses: any,
    onJsonChange: (schema: string) => void,
    onUiChange: (schema: string) => void
}

export type CardParams = {
    data: ID & NameAndDescription & { campaign?: string | number },
    onCardButtonClick: (id: string | number) => void,
    openCampaignInfo?: (id: string | number) => void,
    selectable?: boolean
}

export type CardProps = {
    id: string,
    complete?: boolean,
    name: string,
    description?: string,
    creatable?: boolean,
    selectable?: boolean,
    integrated? : boolean,
    reopened?: boolean
}

export type QuickTaskProps = {
    task: any,
    expand: boolean,
    excluded?: boolean,
    integrated?: boolean,
    handleAction?: (index: number, excluded: boolean) => void,
    handleExclude?: (index: number) => void,
    handleInclude?: (index: number) => void,
    refreshTasks?: () => void
} & CardProps

export type NodeParams = { data: { label: string }, style?: object }

export type PaginationHandlerProps = {
    data: any,
    setDataFunction: (res: string) => void,
    setCountFunction?: (count: number) => void,
    setNextFunction?: (next: string | null) => void,
    setPrevFunction?: (prev: string | null) => void
}