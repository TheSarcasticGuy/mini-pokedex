import React, { ChangeEvent, useEffect, useState } from 'react';
import './App.css';
import Pokedex from '../Pokedex/Pokedex';
import { FluentProvider, TableCellLayout, TableColumnDefinition, createTableColumn, Image, InputOnChangeData, Switch, Spinner, Input, Button, makeStyles } from '@fluentui/react-components';
import { HomeRegular } from "@fluentui/react-icons";
import Details from '../Details/Details';

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

//parent for details
type SpeciesItem = {
  id: PokemonID;
  name: PokemonName;
  height: PokemonHeight;
  weight: PokemonWeight;
  image: Sprite;
  is_baby: boolean;
  is_legendary: boolean;
  is_mythical: boolean;
  has_gender_differences: boolean;
  flavor_text_entries: [];
  types: [];
  cry: string;
};

//for css
const useStyles = makeStyles({
  //to line up top items to right with spacing
  headerBar: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    columnGap: "5px",
  },
});

/**
 * 
 * @returns App component
 */
const App = () => {

  //set poekedex items
  const [pokedexItems, setPokedexItems] = useState<Item[]>([]);
  //search term - initializing to 10 to retrieve only 10 items
  const [loadSearch, setSearch] = useState<string>("10");
  //set flip switch to search by name or bring x pokemon
  const [checked, setChecked] = useState(false);
  /**
   * to decide if we should render pokedex page or detail page
   * 1 is pokedex 2 is details
   **/
  const [currentPage, setView] = useState<number>(1);

  const [open, setOpen] = useState(false);
  //set data for details
  const [selectedPokemon, setSelectedPokemon] = useState<SpeciesItem>();
  //to decide if we should refresh the component
  const [shouldRefresh, setRefresh] = useState<boolean>(false);
  //state for error
  const [isError, setError] = useState<boolean>(false);
  //state for error message
  const [errorMessage, setErrorMessage] = useState<string>("");
  //initialize styles
  const styles = useStyles();

  //for table column info
  const columns: TableColumnDefinition<Item>[] = [
    createTableColumn<Item>({
      columnId: "ID",
      //this is must for sorting
      compare: (a, b) => {
        return a.id.label - b.id.label;
      },
      //funtion to render the header
      renderHeaderCell: () => {
        return "ID";
      },
      //funtion to render the data
      renderCell: (item) => {
        return (
          <TableCellLayout>
            {item.id.label}
          </TableCellLayout>
        );
      },
    }),
    createTableColumn<Item>({
      columnId: "Name",
      compare: (a, b) => {
        return a.name.label.localeCompare(b.name.label);
      },
      renderHeaderCell: () => {
        return "Name";
      },
      renderCell: (item) => {
        return (
          <TableCellLayout>
            {/* to capitalize 1st letter */}
            {item.name.label[0].toUpperCase() +
              item.name.label.slice(1)}
          </TableCellLayout>
        );
      },
    }),
    createTableColumn<Item>({
      columnId: "Height",
      compare: (a, b) => {
        return a.height.label - b.height.label;
      },
      renderHeaderCell: () => {
        return "Height";
      },

      renderCell: (item) => {
        return (
          <TableCellLayout>
            {/* convert the height to inches */}
            {(item.height.label * 3.937).toFixed(2) + " Inches"}
          </TableCellLayout>
        )
      },
    }),
    createTableColumn<Item>({
      columnId: "Weight",
      compare: (a, b) => {
        return a.weight.label - b.weight.label;
      },
      renderHeaderCell: () => {
        return "Weight";
      },
      renderCell: (item) => {
        return (
          <TableCellLayout>
            {/* convert the wright to KGs */}
            {(item.weight.label / 10).toFixed(2) + " KGs"}
          </TableCellLayout>
        );
      },
    }),
    createTableColumn<Item>(
      {
        columnId: "Sprite",
        compare: (a, b) => {
          return a.image.normalUrl.localeCompare(b.image.normalUrl);
        },
        renderHeaderCell: () => {
          return "Sprite";
        },
        renderCell: (item) => {
          return (
            <TableCellLayout>
              {/* show the normal sprite of the pokemon */}
              <Image src={item.image.normalUrl} />
            </TableCellLayout >
          );
        },
      }),
    createTableColumn<Item>(
      {
        columnId: "View",
        renderHeaderCell: () => {
          return "View";
        },
        renderCell: (item) => {
          /**
           * funtion to call species API 
           */
          async function displayDetails(): Promise<void> {
            try {
              //api url with pokemon id
              let speciesUrl: string = "https://pokeapi.co/api/v2/pokemon-species/" + item.id.label;
              //get the respone
              const speciesResponse = await fetch(speciesUrl);
              //extract in json format
              const species = await speciesResponse.json();
              //set the prop for Details component
              let speciesPokemon: SpeciesItem = {
                id: { label: species.id },
                name: { label: species.name },
                height: { label: item.height.label },
                weight: { label: item.weight.label },
                image: { normalUrl: item.image.normalUrl, shinyUrl: item.image.shinyUrl },
                flavor_text_entries: species.flavor_text_entries,
                has_gender_differences: species.has_gender_differences,
                is_baby: species.is_baby,
                is_legendary: species.is_legendary,
                is_mythical: species.is_mythical,
                types: item.types,
                cry: item.cry
              };
              //set display page as Details component
              setView(2);
              //set selected pokemon
              setSelectedPokemon(speciesPokemon);
            } catch (error: any) {
              throw new Error(error.message);
            }
          }
          //this will be displayed
          return (
            <TableCellLayout>
              <Button shape="circular"
                onClick={() => displayDetails()} >View</Button>
            </TableCellLayout >
          );
        },
      }),
  ];

  //this will be called on the initial load of App component
  useEffect(() => {
    //load pokemons
    loadPokemons();
  }, []);

  //this will be called when shouldRefresh state value is true
  useEffect(() => {
    loadPokemons();
  }, [shouldRefresh === true]);

  /**
   * This funtion will load the pokemons based on the count or name and will set them in the respective states
   */
  const loadPokemons = async () => {
    //create a temp array to store pokemon info
    let pokemonArray: Item[] = [];
    //search term
    let searchKey: string = loadSearch;
    //if search term is not a number consider it as name and look for the pokemon
    if (isNaN(+searchKey)) {
      //api for pokemon info with name
      let apiUrl: string = "https://pokeapi.co/api/v2/pokemon/" + searchKey.toLowerCase();
      //get the response
      const response = await fetch(apiUrl);
      //if name is proper
      if (response.status === 200) {
        //get the response
        const pokemonResponse = await response.json();
        //set state of refresh to false
        setRefresh(false);
        //create an item for datagrid with found pokemon
        let foundPokemon: Item = {
          id: { label: pokemonResponse.id },
          name: { label: pokemonResponse.name },
          height: { label: pokemonResponse.height },
          weight: { label: pokemonResponse.weight },
          image: { normalUrl: pokemonResponse.sprites?.front_default, shinyUrl: pokemonResponse.sprites?.front_shiny },
          types: pokemonResponse.types,
          cry: pokemonResponse.cries.latest
        };
        pokemonArray.push(foundPokemon);
      }
      else {
        setError(true);
        setErrorMessage("Pokemon not found");
        setSearch("10");
        setRefresh(true);
      }
    }
    else {
      //loop to get X number of pokemons
      for (let index = 1; index <= parseInt(searchKey); index++) {
        //apiurl for getting pokemon info
        let apiUrl: string = "https://pokeapi.co/api/v2/pokemon/" + index;
        //get the response
        const response = await fetch(apiUrl);
        const pokemonResponse = await response.json();
        let foundPokemon: Item = {
          id: { label: pokemonResponse.id },
          name: { label: pokemonResponse.name },
          height: { label: pokemonResponse.height },
          weight: { label: pokemonResponse.weight },
          image: { normalUrl: pokemonResponse.sprites?.front_default, shinyUrl: pokemonResponse.sprites?.front_shiny },
          types: pokemonResponse.types,
          cry: pokemonResponse.cries.latest
        };
        pokemonArray.push(foundPokemon);
      };
    }
    setPokedexItems(pokemonArray);
  }

  /**
   * this function will be called on change of flipswitch change
   */
  const flipSwitch = React.useCallback(
    (ev: { currentTarget: { checked: boolean | ((prevState: boolean) => boolean); }; }) => {
      setChecked(ev.currentTarget.checked);
    }, [setChecked]
  );

  /**
   * this will be called when input value changes to update the same in a state
   * @param ev 
   * @param data 
   */
  const handleInputChange = (ev: ChangeEvent<HTMLInputElement>, data: InputOnChangeData): void => {
    try {
      setSearch(data.value);
    } catch (error: any) {
      throw new Error(error.message);
    }

  }

  /**
   * This will be called on click of the search of button
   */
  const handleSearch = (): void => {
    try {
      loadPokemons();
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /**
   * Callback funtion for closing the details component
   */
  const handleDetailsClose = (): void => {
    try {
      setView(1);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  /**
   * this function will be called on the click on Home button
   */
  const handleHome = (): void => {
    try {
      setSearch("10");
      setRefresh(true);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  return (
    <FluentProvider>
      <div className={styles.headerBar}>
        <Button size='medium'
          icon={<HomeRegular />}
          onClick={() => handleHome()}
        ></Button>
        <Switch
          onChange={flipSwitch}
          label={checked ? "Search by Name" : "Fetch X Pokemons"}
        />
        <Input
          placeholder={checked ? "Enter name of pokemon" : "Enter x number of pokemons to load"}
          onChange={handleInputChange}
          type={checked ? "text" : "number"}
        />
        <Button
          onClick={() => handleSearch()}
        >Search</Button>
      </div>
      {
        currentPage === 2 ? <Details selectedPokemon={selectedPokemon} handleOnDetailsCloseClick={handleDetailsClose} /> :
          pokedexItems.length > 0 ?
            <Pokedex pokedexItems={pokedexItems} columns={columns} />
            :
            <div>
              <Spinner size="huge" label="Gotta Catch 'Em All" />
            </div>
      }
    </FluentProvider >
  );
}

export default App;