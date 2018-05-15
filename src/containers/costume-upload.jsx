import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import VM from 'scratch-vm';
import {setUser} from '../reducers/user';
import { connect } from 'react-redux'
import analytics from '../lib/analytics';
import costumeLibraryContent from '../lib/libraries/costumes.json';
import LibraryComponent from '../components/costume-upload/costume-upload.jsx';

const custumesUrl = "https://assets.ultrabear.com.cn/custumes";

class CostumeLibrary extends React.PureComponent {
    constructor (props) {
        super(props);
        console.log(props)
        bindAll(this, [
            'handleItemSelected'
        ]);
    }
    handleItemSelected (item) {
        console.log(item)
        const vmCostume = {
            name: item.name,
            rotationCenterX: item.info[0],
            rotationCenterY: item.info[1],
            bitmapResolution: item.info.length > 2 ? item.info[2] : 1,
            skinId: null
        };
        this.props.vm.addCostume(item.md5, vmCostume);
        analytics.event({
            category: 'library',
            action: 'Select Costume',
            label: item.name
        });
    }
    render () {
        return (
            <LibraryComponent
                user={this.props.user}
            />
        );
    }
}

CostumeLibrary.propTypes = {
    onRequestClose: PropTypes.func,
    vm: PropTypes.instanceOf(VM).isRequired,
    user: PropTypes.any
};
const mapStateToProps = state => ({
    user: state.user
});
const mapDispatchToProps = dispatch => ({
    setUser: (user) => dispatch(setUser(user))
});




export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CostumeLibrary);
