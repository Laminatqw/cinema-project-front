import React, {useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../../redux/store";
import {IHall} from "../../../models/IHall";




const HallControlComponent = () => {

    const dispatch = useAppDispatch();
    const {halls, isLoaded, error} = useAppSelector(state => state.hallStore);

    const [selectedHall, setSelectedHall] = useState<IHall|null>(null)
    const [formData, setFormData] = useState<Partial<IHall>>()


    return (
        <div>

        </div>
    );
};

export default HallControlComponent;