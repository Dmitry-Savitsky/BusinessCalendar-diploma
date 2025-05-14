using Microsoft.EntityFrameworkCore;
using BusinessCalendar.Infrastructure.Persistence;
using BusinessCalendar.Application.Services;
using BusinessCalendar.Core.Interfaces;
using BusinessCalendar.Infrastructure;
using BusinessCalendar.Infrastructure.Persistence.Repositories;
using BusinessCalendar.Infrastructure.Repositories;
using BusinessCalendar.Core.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using BusinessCalendar.Presentation.Middleware;
//using BusinessCalendar.Application.Mapping;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var connectionString = builder.Configuration.GetConnectionString("BusinessCalendarConnectionString");
builder.Services.AddDbContext<BusinessCalendarDbContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("BusinessCalendarConnectionString"),
                     ServerVersion.AutoDetect(connectionString),
                     b => b.MigrationsAssembly("BusinessCalendar.Infrastructure")));

//builder.Services.AddAutoMapper(typeof(MappingProfile));

builder.Services.AddScoped<ICompanyRepository, CompanyRepository>();
builder.Services.AddScoped<IExecutorRepository, ExecutorRepository>();
builder.Services.AddScoped<IServiceRepository, ServiceRepository>();
builder.Services.AddScoped<IExecutorHasServiceRepository, ExecutorHasServiceRepository>();
builder.Services.AddScoped<IClientRepository, ClientRepository>();
builder.Services.AddScoped<IExecutorWorkTimeRepository, ExecutorWorkTimeRepository>();
builder.Services.AddScoped<IServiceInOrderRepository, ServiceInOrderRepository>();


builder.Services.AddScoped<CompanyService>();
builder.Services.AddScoped<ExecutorService>();
builder.Services.AddScoped<ServiceService>();
builder.Services.AddScoped<ExecutorHasServiceService>();
builder.Services.AddScoped<ClientService>();
builder.Services.AddScoped<BookingService>();

builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:SecretKey"]))
        };
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("CompanyPolicy", policy => policy.RequireRole("Company"));
    options.AddPolicy("ExecutorPolicy", policy => policy.RequireRole("Executor", "Company"));
});

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseMiddleware<ExceptionHandlingMiddleware>();

//��������� authorize ��� ������������
app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseCors();

app.UseAuthorization();

app.MapControllers();

app.Run();

