import React from "react";

import { Search } from "neetoicons";
import { Modal, Typography, Select, Kbd } from "neetoui";

const SearchBar = ({
  articles,
  showSearchBar,
  setPreviewPath,
  setShowSearchBar,
}) => (
  <Modal
    closeButton={false}
    isOpen={showSearchBar}
    size="large"
    style={{ height: "410px" }}
    onClose={() => setShowSearchBar(false)}
  >
    <div className="neeto-ui-rounded-md m-2">
      <div className="neeto-ui-rounded-md m-2 flex h-10 justify-between bg-gray-200 p-2">
        <div className="flex">
          <Kbd className="mr-1 h-4" keyName="↑" />
          <Kbd className=" h-4" keyName="↓" />
          <Typography style="body2">&nbsp;to navigate</Typography>
        </div>
        <div className="flex">
          <Kbd keyName="Return" />
          <Typography style="body2">&nbsp;to select</Typography>
        </div>
        <div className="mr-1 flex">
          <Kbd keyName="Esc" />
          <Typography style="body2">&nbsp;to close</Typography>
        </div>
      </div>
      <Select
        defaultMenuIsOpen
        isClearable
        isSearchable
        options={articles}
        placeholder={
          <Typography className="flex">
            <Search />
            Search for an article.
          </Typography>
        }
        onChange={article => {
          setPreviewPath(article.value);
          setShowSearchBar(false);
        }}
      />
    </div>
  </Modal>
);
export default SearchBar;
