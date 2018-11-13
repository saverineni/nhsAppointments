// input string dd/MM/yyyy
export function getDateFromDDMMYYYY(dateStr:string):Date{
    var parts = dateStr.split("/");
    var dt = new Date(parseInt(parts[0], 10),
                    parseInt(parts[1], 10) - 1,
                    parseInt(parts[2], 10));

    return dt;
}

