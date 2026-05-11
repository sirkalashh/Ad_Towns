namespace AdTowns.Exceptions;

public class DuplicateEntryException : Exception
{
    public string Field { get; }
    
    public DuplicateEntryException(string field, string message) : base(message)
    {
        Field = field;
    }
}
