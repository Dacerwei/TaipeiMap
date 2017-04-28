import React from 'react';

function Filter(props) {
    return (
        <div className="filterMRTLines">
            <hr/>
            <h3>Taipei Public Transport</h3>
            <label className="layer-control" id="youbike-layer-control">
                <input type="checkbox" defaultChecked="checked" onChange={(e) => props.openYoubikeLayer(e)} />
                YouBike Station Layer
            </label>
            <label className="layer-control" id="mrt-layer-control">
                <input type="checkbox" defaultChecked="checked" onChange={(e) => props.openMrtLayer(e)} />
                MRT Station Layer
            </label>
            <p>Filter Stations by MRT Line</p>
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
        </div>
    );
};

export default Filter;