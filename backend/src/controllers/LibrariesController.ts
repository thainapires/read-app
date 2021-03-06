import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Library from '../models/Library';
import libraryView from '../views/libraries_view'
import * as Yup from 'yup';

export default{
    async index(request: Request, response: Response){
        const librariesRepository = getRepository(Library);
        const libraries = await librariesRepository.find({
            relations: ['images']
        });
        return response.json(libraryView.renderMany(libraries));
    },

    async show(request: Request, response: Response){

        const { id } = request.params;

        const librariesRepository = getRepository(Library);
        const library = await librariesRepository.findOneOrFail(id, {
           relations: ['images'] 
        });
        return response.json(libraryView.render(library));
    },

    async create(request: Request, response: Response){

        const {
            name, 
            latitude,
            longitude,
            about,
            phone,
            website,
            facebook,
            instagram,
            opening_hours,
            open_on_weekends,
        } = request.body;
    
        const librariesRepository = getRepository(Library);

        const requestImages = request.files as Express.Multer.File[];
        const images = requestImages.map(image => {
            return { path: image.filename }
        })

        const data = {
            name, 
            latitude,
            longitude,
            about,
            phone,
            website,
            facebook,
            instagram,
            opening_hours,
            open_on_weekends: open_on_weekends === 'true',
            images,
        };

        const schema = Yup.object().shape({
            name: Yup.string().required(),
            latitude: Yup.number().required(),
            longitude: Yup.number().required(),
            about: Yup.string().required().max(500),
            phone: Yup.string().required(),
            website: Yup.string().required(),
            facebook: Yup.string().required(),
            instagram: Yup.string().required(),
            opening_hours: Yup.string().required(),
            open_on_weekends: Yup.boolean().required(),
            images: Yup.array(
                Yup.object().shape({
                    path: Yup.string().required()
                })
            )
        });
        
        await schema.validate(data, {abortEarly: false, });
        const library = librariesRepository.create(data);
    
        await librariesRepository.save(library);
    
        return response.status(201).json(library);
    }
};