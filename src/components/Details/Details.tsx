import { Button, Image, Option, Text, DialogContent, DialogSurface, DialogTitle, DialogTrigger, DrawerBody, DrawerHeader, DrawerHeaderTitle, OverlayDrawer, Tab, TabList, TabValue, SelectTabEvent, SelectTabData, LargeTitle, Divider, Body1, DataGrid, Table, TableBody, TableRow, TableCell, TableCellLayout, makeStyles, Combobox, SelectionEvents, OptionOnSelectData, Link } from "@fluentui/react-components";
import { Dismiss24Regular } from "@fluentui/react-icons";
import React, { useEffect } from "react";
import { useState } from "react";

const useStyles = makeStyles({
    //class for separating image, description & info
    divide: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "flex-start",
        columnGap: "10%",
    },
});

const Details = (props: any) => {
    //to monitor panel's open/close state
    const [isOpen, setIsOpen] = useState(true);
    //to monitor normal/shiny form tab of pokemon
    const [selectedValue, setSelectedValue] = useState<TabValue>("NormalForm");
    //game type array
    const [gameValues, setGameValues] = useState<[]>([]);
    //game desription
    const [selectedGameDescription, setSelectedGameDescription] = useState<string>();
    //default game key
    const [defaultGameKey, setDefaultGameKey] = useState<string>("");
    //selected options
    const [selectedOptions, setSelectedOptions] = React.useState<string[]>([""]);
    //create an audio object of the cry sound of pokemon
    const crySound = new Audio(props.selectedPokemon.cry);
    //initialize styling
    const styles = useStyles();

    /**
     * This function will be triggered on tab selection & will update the state values
     * @param event 
     * @param data 
     */
    const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
        try {
            setSelectedValue(data.value);
        } catch (error: any) {
            throw new Error(error.message);
        }

    };

    /**
     * This function will be triggered on close of Details drawer
     */
    const handleOnCloseClick = () => {
        try {
            //callback function
            props.handleOnDetailsCloseClick();
            //update the open state of the details component
            setIsOpen(false);
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    //This will be called once while loading the component
    useEffect(() => {
        let options: any = [];
        //get the descriptions in english & update them in game values state in a key-value pair
        props.selectedPokemon.flavor_text_entries.filter(((x: any) => x.language.name === "en")).map(
            (x: any) => {
                options.push({
                    //game name
                    "key": x.version.name,
                    //game description
                    "value": x.flavor_text
                });
            });
        //update in the game values
        setGameValues(options);
    }, []);

    //This will be called when gameValues are updated
    useEffect(() => {
        //get the selected value
        let selectedOption: any = gameValues != undefined && gameValues.length > 0 ? gameValues : [];
        //if there is a value update the name & description in state
        if (selectedOption.length > 0) {
            //update the selected key
            setDefaultGameKey(selectedOption[0].key);
            //update the selected description
            setSelectedGameDescription(selectedOption[0].value);
        }
    }, [gameValues]);

    /**
     * This function will be triggered on the change of game selection
     * @param event 
     * @param data 
     */
    const handleGameChange = (event: SelectionEvents, data: OptionOnSelectData): void => {
        try {
            let text: string = "";
            //get matching game from game values
            let matchingGame: any = gameValues.find((a: any) => a.key.toLowerCase() === data.optionText?.toLowerCase());
            //get description
            text = matchingGame.value;
            //update default game
            setDefaultGameKey(data.optionText ?? "");
            //update selected game
            setSelectedOptions([data.optionText ?? ""]);
            //update description in state
            setSelectedGameDescription(text);
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    /**
     * This function will be called when an sprite is clicked
     * @param event 
     */
    const playAudio = (event: any): void => {
        try {
            crySound.play();
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    return (
        <>
            <OverlayDrawer
                size="large"
                open={isOpen}
                onOpenChange={(_, { open }) => setIsOpen(open)}
                modalType="alert"
            >
                <DrawerHeader>
                    <DrawerHeaderTitle
                        action={
                            <Button
                                appearance="subtle"
                                aria-label="Close"
                                icon={<Dismiss24Regular />}
                                onClick={() => handleOnCloseClick()}
                            />
                        }
                    >
                        Pokedex
                    </DrawerHeaderTitle>
                </DrawerHeader>
                <DrawerBody>
                    <Divider></Divider>
                    <LargeTitle>{props.selectedPokemon.name.label[0].toUpperCase() +
                        props.selectedPokemon.name.label.slice(1)}</LargeTitle>
                    <TabList selectedValue={selectedValue} onTabSelect={onTabSelect}>
                        <Tab value="NormalForm">Normal Form</Tab>
                        <Tab value="ShinyForm">Shiny Form</Tab>
                    </TabList>
                    <div>
                        {selectedValue === "NormalForm" ? <Image onClick={playAudio} alt="Nomral Form" shape="circular" src={props.selectedPokemon.image.normalUrl} height={100} width={100} /> : <Image alt="Shiny Form" shape="circular" src={props.selectedPokemon.image.shinyUrl} height={100} width={100} onClick={playAudio} />}
                    </div>
                    <Divider></Divider>
                    <div className={styles.divide}>
                        <div>
                            <Combobox
                                placeholder="Select Game"
                                onOptionSelect={handleGameChange}
                                defaultSelectedOptions={["Red"]}
                                defaultValue={"Red"}
                            >
                                {gameValues?.map((option: any) => (
                                    <Option key={option.key}>
                                        {option.key[0].toUpperCase() +
                                            option.key.slice(1)}
                                    </Option>
                                ))}
                            </Combobox>
                            <br /><br />
                            <Text>
                                {selectedGameDescription}
                            </Text>
                        </div>
                        <div>
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>
                                            <TableCellLayout>
                                                Pokedex #
                                            </TableCellLayout>
                                        </TableCell>
                                        <TableCell>
                                            <TableCellLayout>
                                                {props.selectedPokemon.id.label}
                                            </TableCellLayout>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <TableCellLayout>
                                                Has Different Appearance per gender?
                                            </TableCellLayout>
                                        </TableCell>
                                        <TableCell>
                                            <TableCellLayout>
                                                {props.selectedPokemon.has_gender_differences ? "Yes" : "No"}
                                            </TableCellLayout>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <TableCellLayout>
                                                Is a baby?
                                            </TableCellLayout>
                                        </TableCell>
                                        <TableCell>
                                            <TableCellLayout>
                                                {props.selectedPokemon.is_baby ? "Yes" : "No"}
                                            </TableCellLayout>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <TableCellLayout>
                                                Is a Legendary?
                                            </TableCellLayout>
                                        </TableCell>
                                        <TableCell>
                                            <TableCellLayout>
                                                {props.selectedPokemon.is_legendary ? "Yes" : "No"}
                                            </TableCellLayout>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <TableCellLayout>
                                                Is a Mythical Pokemon?
                                            </TableCellLayout>
                                        </TableCell>
                                        <TableCell>
                                            <TableCellLayout>
                                                {props.selectedPokemon.is_mythical ? "Yes" : "No"}
                                            </TableCellLayout>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <TableCellLayout>
                                                Type
                                            </TableCellLayout>
                                        </TableCell>
                                        <TableCell>
                                            <TableCellLayout>
                                                {props.selectedPokemon.types.map((pokemonType: any) =>
                                                    pokemonType.type.name[0].toUpperCase() + pokemonType.type.name.slice(1) + " "
                                                )}
                                            </TableCellLayout>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </DrawerBody>
            </OverlayDrawer >
        </>
    )
}

export default Details;