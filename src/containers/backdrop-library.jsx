import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import VM from 'scratch-vm';

import analytics from '../lib/analytics';
// import backdropLibraryContent from '../lib/libraries/backdrops.json';
import LibraryComponent from '../components/library/library.jsx';

import xhr from 'xhr';
import { ASSETS_ROOT } from '../api-config';
const backdropsUrl = `${ASSETS_ROOT}/backdrops`;

class BackdropLibrary extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleItemSelect'
        ]);
        this.state = {
            backdropLibraryContent: []
        }
    }
    handleItemSelect (item) {
        const vmBackdrop = {
            name: item.name,
            rotationCenterX: item.info[0] && item.info[0] / 2,
            rotationCenterY: item.info[1] && item.info[1] / 2,
            bitmapResolution: item.info.length > 2 ? item.info[2] : 1,
            skinId: null
        };
        this.props.vm.addBackdrop(item.md5, vmBackdrop);
        analytics.event({
            category: 'library',
            action: 'Select Backdrop',
            label: item.name
        });
    }
    componentDidMount () {
        xhr({
            uri: custumesUrl
        },(err, resp, body) => {
            body = JSON.parse(body);
            this.setState({costumeLibraryContent: body.data});
        })
    }

    render () {
        return (
            <LibraryComponent
                data={this.state.costumeLibraryContent}
                title="Costume Library - UltraBear"
                onItemSelected={this.handleItemSelect}
                onRequestClose={this.props.onRequestClose}
            />
        );
    }
}

BackdropLibrary.propTypes = {
    onRequestClose: PropTypes.func,
    vm: PropTypes.instanceOf(VM).isRequired
};

export default BackdropLibrary;
