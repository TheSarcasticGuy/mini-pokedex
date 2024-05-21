import React, { useEffect, useState } from "react";
import {
    Image,
    DataGridBody,
    DataGridRow,
    DataGrid,
    DataGridHeader,
    DataGridHeaderCell,
    DataGridCell,
    TableCellLayout,
    TableColumnDefinition,
    createTableColumn,
    Field,
    SearchBox,
    FluentProvider,
} from "@fluentui/react-components";
import type { ButtonProps, InputOnChangeData, SearchBoxChangeEvent } from "@fluentui/react-components";

//For ID
type PokemonID = {
    label: number;
};

//For Name
type PokemonName = {
    label: string;
};

//For height
type PokemonHeight = {
    label: number;
};

//for weight
type PokemonWeight = {
    label: number;
};

//for sprites
type Sprite = {
    normalUrl: string;
    shinyUrl: string;
};

//parent for data grid
type Item = {
    id: PokemonID;
    name: PokemonName;
    height: PokemonHeight;
    weight: PokemonWeight;
    image: Sprite;
    types: [];
    cry: string;
};

const Pokedex = (props: { pokedexItems: Item[]; columns: TableColumnDefinition<Item>[]; }) => {
    return (
        <>
            <FluentProvider>
                <DataGrid
                    as="table"
                    size="medium"
                    items={props.pokedexItems}
                    columns={props.columns}
                    sortable={true}
                    getRowId={(item) => item.name.label}
                    focusMode="composite"
                >
                    <DataGridHeader>
                        <DataGridRow >
                            {({ renderHeaderCell }) => (
                                <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
                            )}
                        </DataGridRow>
                    </DataGridHeader>
                    <DataGridBody<Item>>
                        {({ item, rowId }) => (
                            <DataGridRow<Item>
                                key={rowId}>
                                {({ renderCell }) => (
                                    <DataGridCell>{renderCell(item)}</DataGridCell>
                                )}
                            </DataGridRow>
                        )}
                    </DataGridBody>
                </DataGrid>
            </FluentProvider>
        </>
    );
}

export default Pokedex;