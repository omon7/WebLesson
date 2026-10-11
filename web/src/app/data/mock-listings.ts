import { Listing } from '../models/listing';

export const MOCK_LISTINGS: Listing[] = [
  {
    id: 1,
    title: '2-комн. рядом с метро Чиланзар',
    price: 48000,
    rooms: 2,
    districtId: 1,
    districtName: 'Чиланзар',
    createdAt: '2026-09-01T09:00:00Z',
    address: 'Чиланзар, 12 кв., д. 4'
  },
  {
    id: 2,
    title: '3-комн. с ремонтом',
    price: 71000,
    rooms: 3,
    districtId: 2,
    districtName: 'Юнусабад',
    createdAt: '2026-09-05T10:30:00Z'
  },
  {
    id: 3,
    title: '1-комн. студия',
    price: 32000,
    rooms: 1,
    districtId: 3,
    districtName: 'Мирзо-Улугбек',
    createdAt: '2026-09-08T14:00:00Z'
  },
  {
    id: 4,
    title: '4-комн. с видом на парк',
    price: 95000,
    rooms: 4,
    districtId: 2,
    districtName: 'Юнусабад',
    createdAt: '2026-09-12T08:15:00Z',
    address: 'Юнусабад, 4 кв.'
  },
  {
    id: 5,
    title: '2-комн. после ремонта, тихий двор',
    price: 52000,
    rooms: 2,
    districtId: 1,
    districtName: 'Чиланзар',
    createdAt: '2026-09-15T11:00:00Z'
  },
  {
    id: 6,
    title: '1-комн. у ТРЦ',
    price: 36000,
    rooms: 1,
    districtId: 2,
    districtName: 'Юнусабад',
    createdAt: '2026-09-18T16:45:00Z'
  },
  {
    id: 7,
    title: '3-комн. семейная',
    price: 66000,
    rooms: 3,
    districtId: 3,
    districtName: 'Мирзо-Улугбек',
    createdAt: '2026-09-20T09:30:00Z'
  },
  {
    id: 8,
    title: '2-комн. срочно, торг',
    price: 39000,
    rooms: 2,
    districtId: 1,
    districtName: 'Чиланзар',
    createdAt: '2026-09-24T12:00:00Z'
  }
];