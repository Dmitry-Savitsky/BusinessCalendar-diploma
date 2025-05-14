using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BusinessCalendar.Application.DTOs.ClientsDtos;
using BusinessCalendar.Core.Entities;
using BusinessCalendar.Core.Exceptions;
using BusinessCalendar.Core.Interfaces;

namespace BusinessCalendar.Application.Services
{
    public class ClientService
    {
        private readonly IUnitOfWork _uow;

        public ClientService(IUnitOfWork uow)
        {
            _uow = uow;
        }

        // ****************** CompanyPolicy ******************

        public async Task<List<ClientDto>> GetClientsForCompanyAsync(string companyGuid)
        {
            var company = await _uow.CompanyRepository.GetByGuidAsync(Guid.Parse(companyGuid))
                ?? throw new NotFoundException("Компания не найдена");
            var list = await _uow.ClientRepository.GetByCompanyIdAsync(company.Id);
            return list.Select(c => new ClientDto
            {
                PublicId = c.PublicId,
                ClientName = c.ClientName,
                ClientPhone = c.ClientPhone,
                Addresses = c.Addresses
                    .Select(a => new ClientAddressDto { Id = a.Id, Address = a.Address })
                    .ToList()
            }).ToList();
        }

        public async Task<ClientDto> CreateClientAsync(string companyGuid, ClientCreateDto dto)
        {
            var company = await _uow.CompanyRepository.GetByGuidAsync(Guid.Parse(companyGuid))
                ?? throw new NotFoundException("Компания не найдена");

            var client = new Client
            {
                PublicId = Guid.NewGuid(),
                ClientName = dto.ClientName,
                ClientPhone = dto.ClientPhone,
                CompanyId = company.Id
            };
            await _uow.ClientRepository.AddAsync(client);
            await _uow.SaveChangesAsync();

            if (dto.Addresses != null)
            {
                foreach (var a in dto.Addresses)
                {
                    var addr = new ClientAddress
                    {
                        ClientId = client.Id,
                        Address = a.Address
                    };
                    await _uow.ClientAddresses.AddAsync(addr);
                }
                await _uow.SaveChangesAsync();
            }

            return new ClientDto
            {
                PublicId = client.PublicId,
                ClientName = client.ClientName,
                ClientPhone = client.ClientPhone,
                Addresses = client.Addresses
                    .Select(a => new ClientAddressDto { Id = a.Id, Address = a.Address })
                    .ToList()
            };
        }

        public async Task<ClientDto> UpdateClientAsync(string companyGuid, Guid clientGuid, ClientUpdateDto dto)
        {
            var company = await _uow.CompanyRepository.GetByGuidAsync(Guid.Parse(companyGuid))
                ?? throw new NotFoundException("Компания не найдена");

            var client = await _uow.ClientRepository.GetByPublicIdAndCompanyIdAsync(clientGuid, company.Id)
                ?? throw new NotFoundException("Клиент не найден");

            if (!string.IsNullOrEmpty(dto.ClientName))
                client.ClientName = dto.ClientName;
            if (!string.IsNullOrEmpty(dto.ClientPhone))
                client.ClientPhone = dto.ClientPhone;

            _uow.ClientRepository.Update(client);
            await _uow.SaveChangesAsync();

            return new ClientDto
            {
                PublicId = client.PublicId,
                ClientName = client.ClientName,
                ClientPhone = client.ClientPhone,
                Addresses = client.Addresses
                    .Select(a => new ClientAddressDto { Id = a.Id, Address = a.Address })
                    .ToList()
            };
        }

        public async Task DeleteClientAsync(string companyGuid, Guid clientGuid)
        {
            var company = await _uow.CompanyRepository.GetByGuidAsync(Guid.Parse(companyGuid))
                ?? throw new NotFoundException("Компания не найдена");
            var client = await _uow.ClientRepository.GetByPublicIdAndCompanyIdAsync(clientGuid, company.Id)
                ?? throw new NotFoundException("Клиент не найден");

            _uow.ClientRepository.Delete(client);
            await _uow.SaveChangesAsync();
        }

        public async Task<ClientDto> AddAddressAsync(string companyGuid, Guid clientGuid, ClientAddressCreateDto dto)
        {
            var company = await _uow.CompanyRepository.GetByGuidAsync(Guid.Parse(companyGuid))
                ?? throw new NotFoundException("Компания не найдена");
            var client = await _uow.ClientRepository.GetByPublicIdAndCompanyIdAsync(clientGuid, company.Id)
                ?? throw new NotFoundException("Клиент не найден");

            var addr = new ClientAddress
            {
                ClientId = client.Id,
                Address = dto.Address
            };
            await _uow.ClientAddresses.AddAsync(addr);
            await _uow.SaveChangesAsync();

            // Явно добавляем адрес в коллекцию клиента
            client.Addresses.Add(addr);

            return new ClientDto
            {
                PublicId = client.PublicId,
                ClientName = client.ClientName,
                ClientPhone = client.ClientPhone,
                Addresses = client.Addresses
                    .Select(a => new ClientAddressDto { Id = a.Id, Address = a.Address })
                    .ToList()
            };
        }

        // ****************** Public (no-policy) ******************

        public async Task<ClientDto> SelfRegisterClientAsync(ClientCreateDto dto)
        {
            var client = new Client
            {
                PublicId = Guid.NewGuid(),
                ClientName = dto.ClientName,
                ClientPhone = dto.ClientPhone,
                CompanyId = 0
            };
            await _uow.ClientRepository.AddAsync(client);
            await _uow.SaveChangesAsync();

            if (dto.Addresses != null)
            {
                foreach (var a in dto.Addresses)
                {
                    var addr = new ClientAddress
                    {
                        ClientId = client.Id,
                        Address = a.Address
                    };
                    await _uow.ClientAddresses.AddAsync(addr);
                }
                await _uow.SaveChangesAsync();
            }

            return new ClientDto
            {
                PublicId = client.PublicId,
                ClientName = client.ClientName,
                ClientPhone = client.ClientPhone,
                Addresses = client.Addresses
                    .Select(a => new ClientAddressDto { Id = a.Id, Address = a.Address })
                    .ToList()
            };
        }

        public async Task<ClientDto> SelfAddAddressAsync(Guid clientGuid, ClientAddressCreateDto dto)
        {
            var client = await _uow.ClientRepository.GetByPublicIdAsync(clientGuid)
                ?? throw new NotFoundException("Клиент не найден");

            var addr = new ClientAddress
            {
                ClientId = client.Id,
                Address = dto.Address
            };
            await _uow.ClientAddresses.AddAsync(addr);
            await _uow.SaveChangesAsync();

            // Явно добавляем адрес в коллекцию клиента
            client.Addresses.Add(addr);

            return new ClientDto
            {
                PublicId = client.PublicId,
                ClientName = client.ClientName,
                ClientPhone = client.ClientPhone,
                Addresses = client.Addresses
                    .Select(a => new ClientAddressDto { Id = a.Id, Address = a.Address })
                    .ToList()
            };
        }
    }
}