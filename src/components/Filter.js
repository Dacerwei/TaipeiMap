import React from 'react';

function Filter(props) {
    return (
        <div className="filterMRTLines">
            <hr/>
            <h3>Taipei MRT Stations</h3>
            <p>Filter Entrances by Subway Line</p>
                <select defaultValue="*"
                        type="select"
                        name="filterlines"
                        onChange={(e) => props.filterLines(e)} >
                {
                    props.lines.map((line, i) => {
                      return (
                          <option value={line} key={i}>{line}</option>
                        );
                    }, this)
                }
                </select>
                <label><input type="checkbox"
                            defaultChecked="checked"
                            onChange={(e) => props.openYoubikeLayer(e)} />YouBike Station layer</label>
        </div>
    );
};

export default Filter;