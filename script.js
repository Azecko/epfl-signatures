function changeHTML(user, accreditation, phoneValue) {
    $('.firstname-name').html(`${user.firstname} ${user.name}`)
    $('.fonction').html(user.accreds[accreditation].position)
    $('.epfl-unit').html(user.accreds[accreditation].acronym)
    $('.office-place').html(user.accreds[accreditation].officeList[0] || 'Not defined')
    $('.phone').html(user.accreds[accreditation].phoneList[phoneValue])
    $('.phone').attr('href', `tel:${user.accreds[accreditation].phoneList[phoneValue]}`)
    $('.email').html(`${user.profile}@epfl.ch`)
    $('.email').attr('href', `mailto:${user.profile}@epfl.ch`)
    $('.people').html(`people/${user.profile}`)
    $('.people').attr('href', `https://people.epfl.ch/${user.sciper}`)
}

function generateAndChangeHTML(user, accreditation) {
    changeHTML(user, accreditation, 0)

    let phone = 0;
    if(user.accreds[accreditation].phoneList.length > 1) {
        $('.accred-selection-phone').removeClass('d-none');
        $('#select-accred-phone').empty();

        const accredPhoneSelect = document.getElementById('select-accred-phone')
        for (let i = 0; i < user.accreds[accreditation].phoneList.length; i++) {
            let phoneNumber = user.accreds[accreditation].phoneList[i];
            const option = document.createElement('option');
            const optionText = document.createTextNode(phoneNumber)

            option.appendChild(optionText)
            option.setAttribute('value', i)

            accredPhoneSelect.appendChild(option)
        }

        $("#select-accred-phone").change(function(){
            var phoneValue = $(this).find("option:selected").attr("value");

            changeHTML(user, accreditation, phoneValue)
            phone = phoneValue;
        });
    } else {
        $('.accred-selection-phone').addClass('d-none')
        phone = 0;
    }

    changeHTML(user, accreditation, phone)
}


function getPeopleBySciper(value) {
    $.get(`https://search-api.epfl.ch/api/ldap?q=${value}`, function( data ) {
        if(!data.length || data.length >= 2) {
            $('.alert-danger').html('Sciper is invalid')
            $('.alert-danger').removeClass('d-none')
        } else {
            if(data[0].accreds.length > 1) {
                $('.accred-selection').removeClass('d-none')
                $('.accred-hr').removeClass('d-none')

                $('#select-accred').empty()

                generateAndChangeHTML(data[0], 0)

                const accredSelect = document.getElementById('select-accred')
                for (let i = 0; i < data[0].accreds.length; i++) {
                    let accred = data[0].accreds[i]
                    const option = document.createElement('option');
                    const optionText = document.createTextNode(accred.name)

                    option.appendChild(optionText)
                    option.setAttribute('value', i)

                    accredSelect.appendChild(option)
                }

                $("#select-accred").change(function(){
                    var optionValue = $(this).find("option:selected").attr("value");

                    generateAndChangeHTML(data[0], optionValue)
                });

                $('.alert-danger').addClass('d-none')
                
            } else {
                $('.accred-selection').addClass('d-none')
                $('.accred-hr').addClass('d-none')
                generateAndChangeHTML(data[0], 0)
                $('.alert-danger').addClass('d-none')
            }
        }
    });
}

async function apiCallAutocomplete() {
    var searchData = document.getElementById("sciper-input").value;

    $('#sciper-input').autocomplete({
        minLength: 3,
        source: function (request, response) {
            $.get(`https://search-api.epfl.ch/api/ldap?q=${searchData}`, function(data) {
                var stringList = data.map(function(e) {
                    return {
                        label: `${e.name} ${e.firstname} (${e.sciper})`,
                        value: e.sciper
                    }
                });

                response(stringList)
            })
         }
    });
}